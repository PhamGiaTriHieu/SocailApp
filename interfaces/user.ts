export interface IImagePicker {
  assetId?: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
  uri?: string;
  [key: string]: unknown;
}
export interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  bio?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  create_at?: string;
}

export interface IEditUser {
  name?: string;
  phoneNumber?: string;
  image?: string | null;
  bio?: string;
  address?: string;
}
