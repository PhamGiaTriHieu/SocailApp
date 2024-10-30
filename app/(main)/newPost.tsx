import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import {theme} from '@/constants/theme';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import Avatar from '@/components/Avatar';
import {useAuth} from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import {useLocalSearchParams, useRouter} from 'expo-router';
import Icon from '@/assets/icons';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import {ResizeMode, Video} from 'expo-av';
import {getSupabaseFileUrl} from '@/services/imageService';
import {IFileProps, IPost} from '@/interfaces/file';
import {createOrUpdatePost} from '@/services/postService';
import KeyboardAvoidViewContainer from '@/components/KeyboardAvoidViewContainer';

const NewPost = () => {
  const postDataEdit = useLocalSearchParams();

  const {user} = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [textEditorValue, setTextEditorValue] = useState<any>('');

  // const bodyRef = useRef('');
  const editorRef = useRef<any>(null);

  const [file, setFile] = useState<IFileProps | undefined | null | string>();

  useEffect(() => {
    if (postDataEdit && postDataEdit?.id) {
      setTextEditorValue(postDataEdit?.body);

      postDataEdit?.file
        ? setFile(postDataEdit?.file as string)
        : setFile(null);

      // setTimeout(() => {
      //   editorRef?.current?.setContentHTML(postDataEdit?.body);
      // }, 300);
    }
  }, [editorRef]);

  const onPick = async (isImage: boolean) => {
    const mediaConfig = {
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3] as [number, number],
      quality: 0.7,
    };

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file: IFileProps) => {
    if (!file) return undefined;
    if (typeof file === 'object') return true;

    return false;
  };

  const getFieUri = (file: IFileProps | undefined | null | string) => {
    if (!file) return null;
    if (typeof file === 'string') {
      return getSupabaseFileUrl(file)?.uri;
    }
    if (isLocalFile(file)) {
      return file.uri;
    }
    // TODO: handle remote file return getSupabaseFileUrl(file)?.uri;
    return getSupabaseFileUrl(file.uri);
  };

  const getFileType = (file: IFileProps | string) => {
    if (!file) return null;

    if (typeof file === 'string') {
      const extFile = file.split('/');
      if (Array.isArray(extFile) && extFile.includes('postImages')) {
        return 'image';
      }
      return 'video';
    }
    if (isLocalFile(file)) {
      return file.type;
    }
    // check image or video remote file
    if (Array.isArray(file) && file.includes('postImages')) {
      return 'image';
    }

    return 'video';
  };

  const onSubmit = async () => {
    if (!textEditorValue && !file) {
      Alert.alert('Post', 'Please add a text or an image');
      return;
    }

    let postData: IPost = {
      file,
      body: textEditorValue,
      userId: user?.id,
    };

    if (postDataEdit && postDataEdit?.id)
      postData = {...postData, id: postDataEdit?.id as string};

    // Create post
    setLoading(true);
    const res = await createOrUpdatePost(postData);
    setLoading(false);

    if (res.success) {
      setFile(null);
      setTextEditorValue('');
      // editorRef?.current?.setContentHTML = '';
      router.back();
    } else {
      Alert.alert('Post', 'Could not create post');
    }
  };
  // <Pressable onPress={() => editorRef.current?.dismissKeyboard()}>
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />

        <ScrollView
          contentContainerStyle={{gap: 20}}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => editorRef.current?.dismissKeyboard()}
            style={{gap: 20}}
          >
            {/* Avatar */}
            <View style={styles.header}>
              <Avatar
                uri={user?.image}
                size={heightPercentage(6.5)}
                rounded={theme.radius.xl}
              />
              <View style={{gap: 2}}>
                <Text style={styles.userName}>{user && user?.name}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            <View style={styles.textEditor}>
              <RichTextEditor
                editTextValue={textEditorValue}
                editorRef={editorRef}
                onChange={(value: string) => setTextEditorValue(value)}
              />
            </View>

            {file && (
              <View style={styles.file}>
                {getFileType(file) == 'video' ? (
                  <Video
                    style={{flex: 1}}
                    source={{uri: `${getFieUri(file)}`}}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    isMuted={false}
                    volume={0.4}
                  />
                ) : (
                  <Image
                    source={{uri: `${getFieUri(file)}`}}
                    resizeMode="cover"
                    style={{flex: 1}}
                  />
                )}

                <Pressable
                  style={styles.closeIcon}
                  onPress={() => setFile(null)}
                >
                  <Icon name="deleteIcon" size={20} color="white" />
                </Pressable>
              </View>
            )}
            <View style={styles.media}>
              <Text style={styles.addImageText}>Add to your post</Text>
              <View style={styles.mediaIcon}>
                <TouchableOpacity onPress={() => onPick(true)}>
                  <Icon name="imageIcon" size={30} color={theme.colors.dark} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onPick(false)}>
                  <Icon name="videoIcon" size={33} color={theme.colors.dark} />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </ScrollView>
        <Button
          title={postDataEdit && postDataEdit?.id ? 'Update' : 'Post'}
          loading={loading}
          onPress={onSubmit}
          hasShadow={false}
          buttonStyle={{height: heightPercentage(6.2)}}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
    paddingHorizontal: widthPercentage(4),
    gap: 15,
  },
  title: {
    // marginBottom: 10,
    fontSize: heightPercentage(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userName: {
    fontSize: heightPercentage(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: heightPercentage(6.5),
    width: heightPercentage(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  publicText: {
    fontSize: heightPercentage(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {
    marginTop: 10,
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray,
  },
  mediaIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addImageText: {
    fontSize: heightPercentage(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  imageIcon: {
    // backgroundColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    // padding: 6,
  },
  file: {
    height: heightPercentage(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  video: {},
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: 'rgba(225, 0, 0, 0.6)',
    // shadowColor: theme.colors.textLight,
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 8,
  },
});
