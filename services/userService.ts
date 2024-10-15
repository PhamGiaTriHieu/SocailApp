import {supabase} from '@/lib/supabase';

export const getUserData = async (userId: string) => {
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
    return {success: false, message: error?.message};
  }
};
