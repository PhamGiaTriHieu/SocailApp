import Icon from '@/assets/icons';
import CommentItem from '@/components/CommentItem';
import Input from '@/components/Input';
import KeyboardAvoidViewContainer from '@/components/KeyboardAvoidViewContainer';
import Loading from '@/components/Loading';
import PostCard from '@/components/PostCard';
import {theme} from '@/constants/theme';
import {useAuth} from '@/contexts/AuthContext';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import {IComment, IGetPostsData} from '@/interfaces/commom';
import {supabase} from '@/lib/supabase';
import {createNotification} from '@/services/notificationService';
import {
  createComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from '@/services/postService';
import {getUserData} from '@/services/userService';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PostDetails = () => {
  const {postId, commentId} = useLocalSearchParams();

  const [startLoading, setStartLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<IGetPostsData | null>(null);

  const [inputValue, setInputValue] = useState('');

  const {user} = useAuth();
  const router = useRouter();

  const getPostDetails = async () => {
    if (!postId) return;
    const res = await fetchPostDetails(+postId);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const handleNewComment = async (payload: any) => {
    console.log('🚀 ~ handleNewComment ~ payload:', payload.new);
    if (payload?.new) {
      let newComment = {...payload.new};
      const res = await getUserData(newComment?.userId);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost: any) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    const commentChannel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();

    return () => {
      // postChannel.unsubscribe();
      supabase.removeChannel(commentChannel);
    };
  }, []);

  // onDeletePost
  const onDeletePost = async (item: any) => {
    const res = await removePost(+postId);

    if (res.success) {
      router.back();
    } else {
      Alert.alert('Post', res.message ?? 'Failed to delete the post');
    }
  };
  const onEditPost = async (item: any) => {
    router.back();
    router.push({pathname: '/newPost', params: {...item}});
  };

  const onDeleteComment = async (comment: IComment) => {
    const res = await removeComment(comment?.id as number);

    if (res.success) {
      post &&
        setPost((prevPost: any) => {
          return {
            ...prevPost,
            comments: prevPost.comments.filter(
              (c: any) => c?.id !== comment?.id
            ),
          };
        });
    } else {
      Alert.alert('Comment', res.message ?? 'Failed to delete the comment');
    }
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}
      >
        <Text style={styles.notFound}>Post not found.</Text>
      </View>
    );
  }

  const onNewComment = async () => {
    if (!inputValue || !postId) return;
    const payload = {
      userId: user?.id as string,
      postId: +postId,
      text: inputValue,
    };
    // Create comment
    setLoading(true);
    const res = await createComment(payload);
    setLoading(false);
    if (res.success) {
      if (user?.id !== post?.userId) {
        // send notification
        const notify = {
          senderId: user?.id,
          receiverId: post?.userId,
          title: 'commented on your post',
          data: JSON.stringify({postId: +postId, commentId: res?.data?.id}),
        };
        createNotification(notify);
      }
      setInputValue('');
    } else {
      Alert.alert('Comment', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidViewContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          <PostCard
            item={{...post, comments: [{count: post?.comments?.length}]}}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon={false}
            showDelete={true}
            onDelete={onDeletePost}
            onEdit={onEditPost}
          />

          {/* Comment  input */}

          <View style={styles.inputContainer}>
            <Input
              placeholder="Type comment..."
              placeholderTextColor={theme.colors.textLight}
              containerStyles={{
                flex: 1,
                height: heightPercentage(6.2),
                borderRadius: theme.radius.xl,
              }}
              onChangeText={(value) => setInputValue(value)}
              value={inputValue}
            />

            {loading ? (
              <View style={styles.loading}>
                <Loading size="small" />
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="sendIcon" color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )}
          </View>

          {/* comment List */}
          <View style={{marginVertical: 15, gap: 17}}>
            {post?.comments?.map((comment) => {
              return (
                <CommentItem
                  key={comment?.id?.toString()}
                  item={comment}
                  highLight={comment?.id == commentId}
                  canDelete={
                    comment?.user?.id === user?.id || user?.id === post?.userId
                  }
                  onDelete={onDeleteComment}
                />
              );
            })}

            {post?.comments?.length === 0 && (
              <Text style={{color: theme.colors.text, marginLeft: 5}}>
                Be first to comment!
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidViewContainer>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: widthPercentage(7),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  list: {
    paddingHorizontal: widthPercentage(4),
  },
  sendIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    height: heightPercentage(5.8),
    width: heightPercentage(5.8),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: heightPercentage(2.5),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
  loading: {
    height: heightPercentage(5.8),
    width: heightPercentage(5.8),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale: 1.3}],
  },
});
