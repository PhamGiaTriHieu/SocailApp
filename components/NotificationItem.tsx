import Avatar from '@/components/Avatar';
import {getCreateAt} from '@/constants/common';
import {theme} from '@/constants/theme';
import {heightPercentage} from '@/helpers/commom';
import {INotificationData} from '@/interfaces/commom';
import {Router} from 'expo-router';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface INotificationItemProps {
  item: INotificationData | null;
  router: Router;
}

const NotificationItem = ({item, router}: INotificationItemProps) => {
  console.log('🚀 ~ NotificationItem ~ item:', item);
  const handleClickNotify = () => {
    if (!item?.data) return;
    const {postId, commentId} = JSON.parse(item?.data as any);
    router.push({pathname:'/postDetails' , params: {postId, commentId}});
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleClickNotify}>
      <Avatar uri={item?.sender?.image} size={heightPercentage(5)} />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={(styles.text, {color: theme.colors.textDark})}>
          {item?.title}
        </Text>
      </View>

      <Text style={[styles.text, {color: theme.colors.textLight}]}>
        {getCreateAt(item?.created_at as string)}
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    padding: 15,
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: heightPercentage(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});
