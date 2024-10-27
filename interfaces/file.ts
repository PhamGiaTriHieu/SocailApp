import * as ImagePicker from 'expo-image-picker';
export interface IFileProps extends ImagePicker.ImagePickerAsset {
  postImage?: object;
}

export interface IPost {
  userId: string | undefined;
  file: IFileProps | string | undefined | null;
  body: string;
}