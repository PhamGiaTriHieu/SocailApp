import {supabase} from '@/lib/supabase';

export const createNotification = async (notification: any) => {
  try {
    const {data, error} = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log('notification error: ', error);
      return {success: false, message: 'Something went wrong'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('notification error: ', error);
    return {success: false, message: 'Something went wrong'};
  }
};

export const fetchNotification = async (receiverId: string) => {
  try {
    const {data, error} = await supabase
      .from('notifications')
      .select(
        `
           *,
          sender: senderId(id, name, image)
          `
      )
      .eq('receiverId', receiverId)
      .order('created_at', {ascending: false});

    if (error) {
      console.log('fetchNotification error: ', error);
      return {success: false, message: 'Could not fetch notifications'};
    }

    return {success: true, data};
  } catch (error) {
    console.log('fetchNotification error: ', error);
    return {success: false, message: 'Could not fetch notifications'};
  }
};
