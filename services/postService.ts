import {IPost} from '@/interfaces/file';
import {supabase} from '@/lib/supabase';
import {uploadFile} from '@/services/imageService';

export const createOrUpdatePost = async (post: IPost) => {
  try {
    //upload image
    if (post.file && typeof post.file === 'object') {
      const isImage = post.file?.type == 'image';
      const folderName = isImage ? 'postImages' : 'postVideos';
      const fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const {data, error} = await supabase
      .from('posts')
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log('Create post error: ', error);
      return {success: false, message: 'Could not create post'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('Create post error: ', error);
    return {success: false, message: 'Could not create post'};
  }
};

export const fetchPosts = async (limit = 10) => {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select(
        `
         *,
        user: users (id,name,image),
        postLikes (*)
        `
      )
      .order('created_at', {ascending: false})
      .limit(limit);

    if (error) {
      console.log('Fetch posts error: ', error);
      return {success: false, message: 'Could not fetch posts'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('fetchPost error: ', error);
    return {success: false, message: 'Could not fetch the post'};
  }
};

export const createPostLike = async (postLike: {
  userId: string;
  postId: number;
}) => {
  try {
    const {data, error} = await supabase
      .from('postLikes')
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log('postLike error: ', error);
      return {success: false, message: 'Could not like the posts'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('postLike error: ', error);
    return {success: false, message: 'Could not like the the post'};
  }
};

export const removePostLike = async (postId: number, userId: string) => {
  try {
    const {error} = await supabase
      .from('postLikes')
      .delete()
      .eq('userId', userId)
      .eq('postId', postId);
    if (error) {
      console.log('postLike error: ', error);
      return {success: false, message: 'Could not remove the post like'};
    }

    return {success: true};
  } catch (error) {
    console.log('postLike error: ', error);
    return {success: false, message: 'Could not remove the post like'};
  }
};
