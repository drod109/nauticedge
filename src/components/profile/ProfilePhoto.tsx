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

      // Update user metadata with new photo URL
      const { error: updateError } = await supabase
        .from('users_metadata')
        .update({ 
          photo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

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
        className={`${dimensions} rounded-full ${editable ? 'border-4 border-white' : ''} object-cover shadow-md`}
      />
      {editable && <label 
        htmlFor={`photo-upload-${userId}`}
        className={`absolute ${buttonPosition} bg-white rounded-full ${buttonPadding} shadow-sm hover:shadow transition-shadow cursor-pointer`}
      >
        {uploadingPhoto ? (
          <div className={`${iconSize} border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin`} />
        ) : (
          <Camera className={`${iconSize} text-gray-600`} />
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
    </div>
  );
};

export default ProfilePhoto;