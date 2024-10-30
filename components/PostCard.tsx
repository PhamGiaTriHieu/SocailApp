import React, {useEffect, useState} from 'react';
import {IGetPostsData, IPostLike} from '@/interfaces/commom';
import {User} from '@/interfaces/user';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import {Router} from 'expo-router';
import {theme} from '@/constants/theme';
import Avatar from '@/components/Avatar';
import {
  heightPercentage,
  removeHtmlTags,
  widthPercentage,
} from '@/helpers/commom';
import moment from 'moment';
import Icon from '@/assets/icons';
import RenderHtml from 'react-native-render-html';
import {Image} from 'expo-image';
import {downloadFile, getSupabaseFileUrl} from '@/services/imageService';
import {ResizeMode, Video} from 'expo-av';
import {createPostLike, removePostLike} from '@/services/postService';
import Loading from '@/components/Loading';
import {getCreateAt} from '@/constants/common';

interface IPostCardProps {
  item: IGetPostsData;
  currentUser: User | null;
  router: Router;
  hasShadow?: boolean;
  showMoreIcon?: boolean;
  showDelete?: boolean;
  onDelete?: (item: IGetPostsData) => {};
  onEdit?: (item: IGetPostsData) => {};
}

const textStyles = {
  color: theme.colors.dark,
  fontSize: heightPercentage(1.75),
};
const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete,
  onEdit,
}: IPostCardProps) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  const [loading, setLoading] = useState(false);

  // const createAt = moment(item?.created_at).format('MMM D');
  const createAt = getCreateAt(item?.created_at);
  const [likes, setLikes] = useState<IPostLike[]>([]);

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const liked =
    likes?.length && likes.filter((like) => like?.userId === currentUser?.id)[0]
      ? true
      : false;

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({pathname: '/postDetails', params: {postId: item?.id}});
  };

  const onLike = async () => {
    if (!currentUser?.id && !item?.id) return;

    if (liked) {
      // Remove like
      const updateLikes = likes.filter(
        (like) => like?.userId !== currentUser?.id
      );
      setLikes([...updateLikes]);
      const res = await removePostLike(
        item?.id as number,
        currentUser?.id as string
      );
      if (!res.success) {
        Alert.alert('Liked', 'Something went wrong while liking the post.');
      }
    } else {
      // Create like
      const payload = {
        userId: currentUser?.id as string,
        postId: item?.id as number,
      };
      const res = await createPostLike(payload);
      if (!res.success) {
        Alert.alert('Liked', 'Something went wrong while liking the post.');
      }
      setLikes([...likes, payload]);
    }
  };

  const onShare = async () => {
    let content: {message: string; url?: any} = {
      message: removeHtmlTags(item?.body),
    };

    if (item?.file) {
      // need to download the file and share it
      setLoading(true);
      const url = await downloadFile(
        getSupabaseFileUrl(item?.file)?.uri as string
      );
      setLoading(false);
      content = {...content, url: url};
    }

    Share.share(content);
  };

  const handlePostDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this?', [
      {
        text: 'Cancel',
        onPress: () => console.log('modal cancel'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onDelete!(item),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* User info and Posts */}
        <View style={styles.userInfo}>
          <Avatar
            size={heightPercentage(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{gap: 2}}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createAt}</Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontalIcon"
              size={heightPercentage(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser?.id === item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit!(item)}>
              <Icon
                name="editIcon"
                size={heightPercentage(2.5)}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePostDelete}>
              <Icon
                name="deleteIcon"
                size={heightPercentage(2.5)}
                color={theme.colors.rose}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Post body & Media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              source={{html: item?.body}}
              contentWidth={widthPercentage(100)}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
        {/* Post Image */}
        {item?.file && item?.file.includes('postImage') && (
          <Image
            source={getSupabaseFileUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}
        {/* Post Video */}
        {item?.file && item?.file.includes('postVideos') && (
          <Video
            style={[styles.postMedia, {height: heightPercentage(30)}]}
            source={{uri: getSupabaseFileUrl(item?.file)?.uri as string}}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
          />
        )}
      </View>

      {/* Like comments & Share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heartIcon"
              size={24}
              fill={liked ? theme.colors.rose : 'transparent'}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="commentIcon" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments?.[0]?.count}</Text>
        </View>

        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="shareIcon" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: 'continuous',
    padding: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  username: {
    fontSize: heightPercentage(1.8),
    color: theme.colors.dark,
    fontWeight: theme.fonts.semibold,
  },
  postTime: {
    fontSize: heightPercentage(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    height: heightPercentage(40),
    width: '100%',
    borderRadius: theme.radius.xl,
    borderCurve: 'circular',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  count: {
    fontSize: heightPercentage(1.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
});
