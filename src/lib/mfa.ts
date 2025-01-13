import { supabase } from './supabase';
import { getBrowserInfo } from '../utils/browser';
import { getLocationInfo } from '../utils/location';

// Generate a random secret key for TOTP using browser-safe methods
function generateSecret(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  const randomValues = new Uint32Array(20);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < 20; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

// Generate recovery codes
function generateRecoveryCodes(count: number = 10): string[] {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const array = new Uint32Array(5);
    window.crypto.getRandomValues(array);
    codes.push(
      Array.from(array)
        .map(b => (b % 256).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }
  return codes;
}

// Initialize MFA setup
export async function initializeMFASetup() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if MFA is already set up
    const { data: existingMFA } = await supabase
      .from('user_mfa')
      .select('enabled')
      .eq('user_id', user.id)
      .single();

    if (existingMFA?.enabled) {
      throw new Error('MFA is already enabled for this account');
    }

    // Delete any existing temporary setup
    await supabase
      .from('mfa_temp')
      .delete()
      .eq('user_id', user.id);

    const secret = generateSecret();
    const recoveryCodes = generateRecoveryCodes();

    // Store temporary setup data
    const { error } = await supabase
      .from('mfa_temp')
      .insert({
        user_id: user.id,
        secret,
        recovery_codes: recoveryCodes
      });

    if (error) throw error;

    return {
      secret,
      recoveryCodes,
      otpauthUrl: `otpauth://totp/NauticEdge:${user.email}?secret=${secret}&issuer=NauticEdge`
    };
  } catch (error) {
    console.error('Error initializing MFA setup:', error);
    throw error;
  }
}

// Complete MFA setup
export async function completeMFASetup(verificationCode: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get temporary setup data
    const { data: tempData, error: tempError } = await supabase
      .from('mfa_temp')
      .select('secret, recovery_codes')
      .eq('user_id', user.id)
      .single();

    if (tempError || !tempData) throw new Error('MFA setup not initialized');

    // For demo purposes, accept any 6-digit code
    // In production, implement proper TOTP verification
    if (!/^\d{6}$/.test(verificationCode)) {
      throw new Error('Invalid verification code format');
    }

    // Store MFA settings
    const { error: mfaError } = await supabase
      .from('user_mfa')
      .upsert({
        user_id: user.id,
        secret: tempData.secret,
        backup_codes: tempData.recovery_codes,
        enabled: true,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (mfaError) throw mfaError;

    // Clean up temporary data
    await supabase
      .from('mfa_temp')
      .delete()
      .eq('user_id', user.id);

    return true;
  } catch (error) {
    console.error('Error completing MFA setup:', error);
    throw error;
  }
}

// Verify MFA during login
export async function verifyMFALogin(code: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get user's MFA settings
    const { data: mfaData, error: mfaError } = await supabase
      .from('user_mfa')
      .select('secret, enabled')
      .eq('user_id', user.id)
      .single();

    if (mfaError) throw mfaError;
    if (!mfaData?.enabled) throw new Error('MFA not enabled');

    // For demo purposes, accept any 6-digit code
    // In production, implement proper TOTP verification
    if (!/^\d{6}$/.test(code)) {
      throw new Error('Invalid verification code format');
    }

    // Log verification attempt
    const browserInfo = getBrowserInfo();
    const locationInfo = await getLocationInfo();

    await supabase
      .from('mfa_verification_attempts')
      .insert({
        user_id: user.id,
        ip_address: '0.0.0.0', // Will be set by server
        success: true,
        device_info: {
          type: browserInfo.isMobile ? 'mobile' : 'desktop',
          browser: browserInfo.browser,
          os: browserInfo.os,
          location: locationInfo
        }
      });

    // Update last used timestamp
    await supabase
      .from('user_mfa')
      .update({
        last_used_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    return true;
  } catch (error) {
    console.error('Error verifying MFA login:', error);
    throw error;
  }
}

// Check if user has MFA enabled
export async function checkMFAStatus() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_mfa')
      .select('enabled')
      .eq('user_id', user.id)
      .maybeSingle();

    return data?.enabled || false;
  } catch (error) {
    console.error('Error checking MFA status:', error);
    return false;
  }
}