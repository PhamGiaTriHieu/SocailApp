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
  const [loading, setLoading] = useState(false);
  const {user, setAuth} = useAuth();

  const [posts, setPosts] = useState<IGetPostsData[]>([]);

  const [limitPosts, setLimitPosts] = useState<number>(4);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload: any) => {
    console.log('🚀 ~ got post event', payload);

    if (payload?.eventType === 'INSERT' && payload?.new?.id) {
      let newPost = {...payload.new};
      const res = await getUserData(newPost?.userId);
      newPost.user = res.success ? res.data : {};
      setPosts((prevPost) => [newPost, ...prevPost]);
    }
    return {};
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

    // getPosts();

    return () => {
      // postChannel.unsubscribe();
      supabase.removeChannel(postChannel);
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
  },
});
