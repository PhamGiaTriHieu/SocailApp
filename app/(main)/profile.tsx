import React, {useState} from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '@/contexts/AuthContext';
import {Router, useRouter} from 'expo-router';
import {User} from '@/interfaces/user';
import Header from '@/components/Header';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import Icon from '@/assets/icons';
import {theme} from '@/constants/theme';
import {supabase} from '@/lib/supabase';
import Avatar from '@/components/Avatar';
import {fetchPosts} from '@/services/postService';
import {IGetPostsData} from '@/interfaces/commom';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';

interface IUserHeaderProps {
  user?: User | null;
  router?: Router;
  handleLogout?: () => void;
}

const Profile = () => {
  const {user} = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<IGetPostsData[]>([]);
  const [limitPosts, setLimitPosts] = useState<number>(10);
  const [hasMore, setHasMore] = useState(true);

  const getPosts = async () => {
    if (!hasMore) return;

    const res = await fetchPosts(limitPosts, user?.id);

    const postFiltered = res?.data?.filter((post) => post.userId === user?.id);
    console.log('🚀 ~ getPosts ~ postFiltered:', postFiltered);

    if (res.success) {
      if (posts.length === postFiltered?.length) {
        console.log('heeeeet');
        setHasMore(false);
      }
      // setPosts(res.data as IGetPostsData[]);
      postFiltered ? setPosts(postFiltered) : setPosts([]);
    }
  };

  const onLogout = async () => {
    const {error} = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('modal cancel'),
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => onLogout(),
        style: 'destructive',
      },
    ]);
  };
  return (
    <ScreenWrapper bg="white">
      <FlatList
        ListHeaderComponent={
          <UserHeader user={user} router={router} handleLogout={handleLogout} />
        }
        ListHeaderComponentStyle={{marginBottom: 30}}
        data={posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => {
          return <PostCard item={item} currentUser={user} router={router} />;
        }}
        onEndReached={() => {
          setLimitPosts((prevLimit) => prevLimit + 10);
          getPosts();
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={
          hasMore ? (
            <View style={{marginVertical: posts?.length === 0 ? 100 : 30}}>
              <Loading />
            </View>
          ) : (
            <View style={{marginVertical: 30}}>
              <Text style={styles.noPosts}>No more posts</Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({user, router, handleLogout}: IUserHeaderProps) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: widthPercentage(4),
      }}
    >
      <View>
        <Header title="Profile" mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logoutIcon" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{gap: 15}}>
          <View style={styles.avatarContainer}>
            <Avatar
              uri={user?.image}
              size={heightPercentage(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router?.push('/editProfile')}
            >
              <Icon name="editIcon" strokeWidth={2.5} size={20} />
            </Pressable>
          </View>
          {/* username and address */}
          <View style={{alignItems: 'center', gap: 4}}>
            <Text style={styles.userName}>{user && user?.name}</Text>
            <Text style={styles.infoText}>{user && user?.address}</Text>
          </View>

          {/* email, phone, bio */}
          <View style={{gap: 4}}>
            {/* email */}
            <View style={styles.info}>
              <Icon name="mailIcon" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{user && user?.email}</Text>
            </View>
            {/* phone */}
            {user && user?.phoneNumber && (
              <View style={styles.info}>
                <Icon
                  name="callIcon"
                  size={20}
                  color={theme.colors.textLight}
                />
                <Text style={styles.infoText}>{user && user?.phoneNumber}</Text>
              </View>
            )}
            {/* bio */}
            {user && user?.bio && (
              <Text style={styles.infoText}>{user && user?.bio}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: widthPercentage(4),
    marginBottom: 20,
  },
  headerShape: {
    width: widthPercentage(100),
    height: heightPercentage(20),
  },
  avatarContainer: {
    height: heightPercentage(12),
    width: heightPercentage(12),
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -12,
    padding: 7,
    backgroundColor: 'white',
    borderRadius: 50,
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: heightPercentage(3),
    fontWeight: '500',
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: heightPercentage(1.6),
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.backgroundLogoutColor,
  },
  listStyle: {
    paddingHorizontal: widthPercentage(4),
    paddingBottom: 30,
  },
  noPosts: {
    fontSize: heightPercentage(2),
    textAlign: 'center',
    color: theme.colors.text,
  },
});
