import {supabase} from '@/lib/supabase';

export const getUserData = async (userId: string) => {
  console.log('🚀 ~ getUserData ~ userId:', userId);

  try {
    const {data, error} = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (error) {
      return {success: false, message: error?.message};
    }

    return {success: true, data};
  } catch (error: any) {
    console.log('🚀 ~ getUserData ~ error:', error);
    return {success: false, message: error?.message};
  }
};
