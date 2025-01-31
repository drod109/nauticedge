import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

class KeyVaultService {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  private encryptionKey: string;

  constructor() {
    // Use environment variable key or generate a secure 256-bit key
    if (!import.meta.env.VITE_ENCRYPTION_KEY) {
      // Generate a 32-byte (256-bit) key
      const array = new Uint8Array(32); // 32 bytes = 256 bits
      crypto.getRandomValues(array);
      this.encryptionKey = btoa(String.fromCharCode(...array));
      
      logger.warn('Using generated encryption key - this is not recommended for production');
    } else {
      // Ensure environment key is proper length (32 bytes / 256 bits)
      const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
      if (envKey.length !== 44) { // Base64 encoded 32 bytes is ~44 chars
        const array = new Uint8Array(32);
        const encoder = new TextEncoder();
        // Use env key as seed for deterministic key generation
        array.set(encoder.encode(envKey.repeat(Math.ceil(32 / envKey.length))).slice(0, 32));
        this.encryptionKey = btoa(String.fromCharCode(...array));
        logger.warn('Environment encryption key was padded to 256 bits');
      } else {
        this.encryptionKey = envKey;
      }
    }
  }

  private async encrypt(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    // Convert base64 key to Uint8Array for importKey
    const keyData = Uint8Array.from(atob(this.encryptionKey), c => c.charCodeAt(0));
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(encryptedText: string): Promise<string> {
    const combined = new Uint8Array(
      atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    // Convert base64 key to Uint8Array for importKey
    const keyData = Uint8Array.from(atob(this.encryptionKey), c => c.charCodeAt(0));
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  }

  async storeSecureKey(keyName: string, value: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        // Store in memory if not authenticated
        sessionStorage.setItem(`secure_key_${keyName}`, value);
        return;
      }

      if (!value) {
        throw new Error('Value is required');
      }

      const encryptedValue = await this.encrypt(value);

      const { error } = await this.supabase
        .from('secure_keys')
        .upsert({
          user_id: user.id,
          key_name: keyName,
          encrypted_value: encryptedValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key_name'
        });

      if (error) throw error;

      logger.info('Secure key stored successfully', { keyName });
    } catch (error) {
      logger.error('Failed to store secure key', { keyName, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async getSecureKey(keyName: string): Promise<string | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        // Retrieve from memory if not authenticated
        return sessionStorage.getItem(`secure_key_${keyName}`);
      }

      const { data, error } = await this.supabase
        .from('secure_keys')
        .select('encrypted_value')
        .eq('user_id', user.id)
        .eq('key_name', keyName)
        .single();

      if (error) throw error;
      if (!data) return null;

      const decryptedValue = await this.decrypt(data.encrypted_value);
      return decryptedValue;
    } catch (error) {
      logger.error('Failed to retrieve secure key', { error, keyName });
      return null;
    }
  }

  async deleteSecureKey(keyName: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await this.supabase
        .from('secure_keys')
        .delete()
        .eq('user_id', user.id)
        .eq('key_name', keyName);

      if (error) throw error;

      logger.info('Secure key deleted successfully', { keyName });
    } catch (error) {
      logger.error('Failed to delete secure key', { error, keyName });
      throw error;
    }
  }
}

// Create and export a single instance of the service
export const keyVaultService = new KeyVaultService();