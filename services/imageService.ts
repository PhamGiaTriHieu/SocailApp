import * as FileSystem from 'expo-file-system';
import {decode} from 'base64-arraybuffer';
import {supabase} from '@/lib/supabase';

export const getUserImageSrc = (imagePath: string | undefined | null) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require('@/assets/images/defaultUser.png');
  }
};

export const getSupabaseFileUrl = (filePath: string) => {
  if (filePath) {
    return {
      uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

const getLocalFilePath = (filePath: string) => {
  const fileName = filePath.split('/').pop();
  console.log('fileName: ', fileName);
  console.log('documentDirectory: ', FileSystem.documentDirectory);
  return `${FileSystem.documentDirectory}${fileName}`;
};

export const downloadFile = async (url: string) => {
  try {
    const {uri} = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    console.log('file download error: ', error);
    return {success: false, message: 'Could not download media file'};
  }
};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true
) => {
  try {
    const fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imageData = decode(fileBase64); // Upload file using `ArrayBuffer` from base64 file data

    const {data, error} = await supabase.storage
      .from('uploads')
      .upload(fileName, imageData, {
        cacheControl: '3600',
        upsert: false,
        contentType: isImage ? 'image/*' : 'video/*',
      });

    if (error) {
      console.log('file upload error: ', error);
      return {success: false, message: 'Could not upload media'};
    }

    return {success: true, data: data.path};
  } catch (error) {
    console.log('file upload error: ', error);
    return {success: false, message: 'Could not upload media'};
  }
};

export const getFilePath = (folderName: string, isImage: boolean) => {
  // profile/1234.png
  return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
};
