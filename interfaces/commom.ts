import {User} from '@/interfaces/user';

export interface IPostLike {
  userId: string;
}
export interface IComment {
  count: number | undefined;
  id?: string | number;
  text?: string;
  user?: User;
  created_at?: string;
}

export interface IGetPostsData {
  body: string;
  created_at: string;
  file: string | null;
  id: string | number;
  user: User;
  postLikes: IPostLike[];
  comments?: IComment[];
  userId?: string;
}

export interface INotificationData {
  created_at: string;
  data: {postId: any; userId: any};
  id: number;
  receiverId: string;
  sender: {id: string; name: string; image: string};
  senderId: string;
  title: string;
}
