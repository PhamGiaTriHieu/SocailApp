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

export const fetchPosts = async (limit = 10, userId?: string) => {
  try {
    if (userId) {
      const {data, error} = await supabase
        .from('posts')
        .select(
          `
         *,
        user: users (id,name,image),
        postLikes (*),
        comments (count)
        `
        )
        .order('created_at', {ascending: false})
        .eq('userId', userId)
        .limit(limit);

      if (error) {
        console.log('Fetch posts error: ', error);
        return {success: false, message: 'Could not fetch posts'};
      }

      return {success: true, data};
    } else {
      const {data, error} = await supabase
        .from('posts')
        .select(
          `
         *,
        user: users (id,name,image),
        postLikes (*),
        comments (count)
        `
        )
        .order('created_at', {ascending: false})
        .limit(limit);

      if (error) {
        console.log('Fetch posts error: ', error);
        return {success: false, message: 'Could not fetch posts'};
      }

      return {success: true, data};
    }
  } catch (error) {
    console.log('fetchPost error: ', error);
    return {success: false, message: 'Could not fetch the post'};
  }
};

export const fetchPostDetails = async (postId: string | number) => {
  try {
    const {data, error} = await supabase
      .from('posts')
      .select(
        `
         *,
        user: users (id,name,image),
        postLikes (*),
        comments (*, user: users(id,name,image))
        `
      )
      .eq('id', postId)
      .order('created_at', {ascending: false, foreignTable: 'comments'})
      .single();

    if (error) {
      console.log('fetchPostDetails error: ', error);
      return {success: false, message: 'Could not fetch posts'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('fetchPostDetails error: ', error);
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

export const createComment = async (comment: {
  userId: string;
  postId: number;
  text: string;
}) => {
  try {
    const {data, error} = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log('comment error: ', error);
      return {success: false, message: 'Could not create your comment'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('comment error: ', error);
    return {success: false, message: 'Could not create your comment'};
  }
};

export const removeComment = async (commentId: number) => {
  try {
    const {error} = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (error) {
      console.log('remove error: ', error);
      return {success: false, message: 'Could not remove the comment'};
    }

    return {success: true, data: {commentId}};
  } catch (error) {
    console.log('remove error: ', error);
    return {success: false, message: 'Could not remove the comment'};
  }
};

export const removePost = async (postId: number) => {
  try {
    const {error} = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      console.log('remove post error: ', error);
      return {success: false, message: 'Could not remove the post'};
    }

    return {success: true, data: {postId}};
  } catch (error) {
    console.log('remove post error: ', error);
    return {success: false, message: 'Could not remove the post'};
  }
};
