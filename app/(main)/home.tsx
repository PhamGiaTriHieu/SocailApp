import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';

import {useAuth} from '@/contexts/AuthContext';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import {theme} from '@/constants/theme';
import Icon from '@/assets/icons';
import {useRouter} from 'expo-router';
import Avatar from '@/components/Avatar';
import {fetchPosts} from '@/services/postService';
import {IGetPostsData} from '@/interfaces/commom';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import {supabase} from '@/lib/supabase';
import {getUserData} from '@/services/userService';

const Home = () => {
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const {user, setAuth} = useAuth();
  const [posts, setPosts] = useState<IGetPostsData[]>([]);
  const [limitPosts, setLimitPosts] = useState<number>(4);
  const [notificationCount, seNotificationCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload: any) => {
    console.log('🚀 ~ handlePostEvent ~ payload:', payload);
    if (payload?.eventType === 'INSERT' && payload?.new?.id) {
      let newPost = {...payload.new};
      const res = await getUserData(newPost?.userId);
      newPost.postLikes = [];
      newPost.comments = [{count: 0}];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPost) => [newPost, ...prevPost]);
    }
    if (payload?.eventType === 'DELETE' && payload?.old?.id) {
      console.log('deleted');
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old?.id)
      );
    }
    if (payload?.eventType === 'UPDATE' && payload?.new?.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.map((post) => {
          if (post?.id === payload.new?.id) {
            post.body = payload.new?.body;
            post.file = payload.new?.file;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  };

  const handleNewNotification = async (payload: any) => {
    console.log('🚀 ~ handleNewNotification ~ payload:', payload);
    if (payload?.eventType === 'INSERT' && payload?.new?.id) {
      seNotificationCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const postChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'posts'},
        handlePostEvent
      )
      .subscribe();

    const notificationChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiverId=eq.${user?.id}`,
        },

        handleNewNotification
      )
      .subscribe();

    // getPosts();

    return () => {
      // postChannel.unsubscribe();
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return;

    const res = await fetchPosts(limitPosts);

    if (res.success) {
      if (posts.length === res.data?.length) {
        console.log('heeeeet');
        setHasMore(false);
      }
      setPosts(res.data as IGetPostsData[]);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Link Up</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                seNotificationCount(0);
                router.push('/notifications');
              }}
            >
              <Icon
                name="heartIcon"
                size={heightPercentage(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
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

        {/* Posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => {
            return <PostCard item={item} currentUser={user} router={router} />;
          }}
          onEndReached={() => {
            setLimitPosts((prevLimit) => prevLimit + 4);
            getPosts();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{marginVertical: posts?.length === 0 ? 200 : 30}}>
                <Loading />
              </View>
            ) : (
              <View style={{marginVertical: 30}}>
                <Text style={styles.noPosts}>No more posts</Text>
              </View>
            )
          }
        />
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
    height: heightPercentage(2.2),
    width: heightPercentage(2.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: 'white',
    fontSize: heightPercentage(1.2),
    fontWeight: theme.fonts.bold,
  },
});
