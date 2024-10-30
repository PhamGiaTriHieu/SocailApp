import React, {useEffect, useState} from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import {theme} from '@/constants/theme';
import {useAuth} from '@/contexts/AuthContext';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import {INotificationData} from '@/interfaces/commom';
import {fetchNotification} from '@/services/notificationService';
import {useRouter} from 'expo-router';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import NotificationItem from '@/components/NotificationItem';
import Header from '@/components/Header';
const Notifications = () => {
  const {user} = useAuth();
  const [notifications, setNotifications] = useState<INotificationData[]>([]);

  const router = useRouter();

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    if (!user?.id) return;
    const res = await fetchNotification(user?.id);
    if (res.success) setNotifications(res.data as INotificationData[]);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notification" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => {
            return (
              <NotificationItem key={item?.id} item={item} router={router} />
            );
          })}

          {notifications?.length == 0 && (
            <Text style={styles.noData}>No notifications yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercentage(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: heightPercentage(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
