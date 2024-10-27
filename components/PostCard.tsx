import React from 'react';
import {IGetPostsData} from '@/interfaces/commom';
import {User} from '@/interfaces/user';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Router} from 'expo-router';
import {theme} from '@/constants/theme';
import Avatar from '@/components/Avatar';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import moment from 'moment';
import Icon from '@/assets/icons';
import RenderHtml from 'react-native-render-html';
import {Image} from 'expo-image';
import {getSupabaseFileUrl} from '@/services/imageService';
import {ResizeMode, Video} from 'expo-av';

interface IPostCardProps {
  item: IGetPostsData;
  currentUser: User | null;
  router: Router;
  hasShadow?: boolean;
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

  const createAt = moment(item?.created_at).format('MMM D');

  const openPostDetails = () => {};

  const likes = [];
  const liked = false;

  const comments = [];

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

        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontalIcon"
            size={heightPercentage(3.4)}
            strokeWidth={3}
            color={theme.colors.text}
          />
        </TouchableOpacity>
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
          <TouchableOpacity>
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
          <TouchableOpacity>
            <Icon name="commentIcon" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{comments?.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="shareIcon" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
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
  count: {
    fontSize: heightPercentage(1.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
});
