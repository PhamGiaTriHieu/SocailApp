import React, {useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import Button from '@/components/Button';

import {supabase} from '@/lib/supabase';
import {useAuth} from '@/contexts/AuthContext';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import {theme} from '@/constants/theme';
import Icon from '@/assets/icons';
import {useRouter} from 'expo-router';
import Avatar from '@/components/Avatar';

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {user, setAuth} = useAuth();

  // const onLogout = async () => {
  //   setLoading(true);
  //   setAuth(null);
  //   const {error} = await supabase.auth.signOut();
  //   setLoading(false);
  //   if (error) {
  //     setLoading(false);
  //     Alert.alert('Error', 'Failed to log out. Please try again.');
  //   }
  // };
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Link Up</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push('/notifications')}>
              <Icon
                name="heartIcon"
                size={heightPercentage(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>

            <Pressable onPress={() => router.push('/newPost')}>
              <Icon
                name="plusIcon"
                size={heightPercentage(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>

            <Pressable onPress={() => router.push('/profile')}>
              <Avatar
                uri={user?.image}
                size={heightPercentage(4.3)}
                rounded={theme.radius.sm}
                style={{borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {/* <Button loading={loading} title="Logout" onPress={onLogout} /> */}
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: widthPercentage(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: heightPercentage(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: heightPercentage(4.3),
    width: heightPercentage(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: widthPercentage(4),
  },
  noPosts: {
    fontSize: heightPercentage(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
  pill: {
    position: 'absolute',
    right: -10,
    top: -4,
  },
});
