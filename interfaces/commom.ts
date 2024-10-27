import {User} from '@/interfaces/user';

export interface IGetPostsData {
  body: string;
  created_at: string;
  file: string | null;
  id: string | number;
  user: User;
}
