import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfilePhotoProps {
  userId: string;
  photoUrl: string | null;
  fullName: string;
  size?: 'sm' | 'lg';
  editable?: boolean;
  onPhotoUpdate?: (url: string) => void;
  className?: string;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  userId,
  photoUrl,
  fullName,
  size = 'lg',
  editable = false,
  onPhotoUpdate,
  className = ''
}) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploadingPhoto(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      // Update user profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .single();

      if (updateError) throw updateError;

      // Notify parent component
      if (onPhotoUpdate) {
        onPhotoUpdate(publicUrl);
      }

    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const dimensions = size === 'sm' ? 'w-8 h-8' : 'w-24 h-24';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const buttonPosition = size === 'sm' ? 'bottom-0 right-0' : 'bottom-1 right-1';
  const buttonPadding = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`}
        alt={fullName}
        className={`${dimensions} rounded-full ${
          editable ? 'ring-4 ring-white dark:ring-dark-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-900/30' : ''
        } object-cover shadow-lg transition-all duration-300 group-hover:shadow-xl`}
      />
      {editable && <label 
        htmlFor={`photo-upload-${userId}`}
        className={`absolute ${buttonPosition} bg-white dark:bg-dark-800 rounded-full ${buttonPadding} shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group-hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/20`}
      >
        {uploadingPhoto ? (
          <div className={`${iconSize} border-2 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin`} />
        ) : (
          <Camera className={`${iconSize} text-blue-600 dark:text-blue-400`} />
        )}
      </label>}
      {editable && <input
        type="file"
        id={`photo-upload-${userId}`}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
        disabled={uploadingPhoto}
      />}
      {uploadingPhoto && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-full">
          <div className="text-xs text-white">Uploading...</div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;