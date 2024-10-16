import React, {useEffect, useState} from 'react';
import Icon from '@/assets/icons';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import {theme} from '@/constants/theme';
import {useAuth} from '@/contexts/AuthContext';
import {heightPercentage, widthPercentage} from '@/helpers/commom';
import {IEditUser} from '@/interfaces/user';
import {getUserImageSrc, uploadFile} from '@/services/imageService';
import {updateUser} from '@/services/userService';
import {Image} from 'expo-image';
import {useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const EditProfile = () => {
  const router = useRouter();
  const {user: currentUser, setUserData} = useAuth();

  const [loading, setLoading] = useState(false);
  const [isImageChanging, setIsImageChanging] = useState(false);

  const [user, setUser] = useState<IEditUser>({
    name: '',
    phoneNumber: '',
    image: null,
    bio: '',
    address: '',
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser?.name || '',
        phoneNumber: currentUser?.phoneNumber || '',
        image: currentUser?.image,
        bio: currentUser?.bio || '',
        address: currentUser?.address || '',
      });
    }
  }, [currentUser]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({...user, image: result.assets[0].uri});
      setIsImageChanging(true);
    } else {
      setIsImageChanging(false);
    }
  };

  const onSubmit = async () => {
    if (!currentUser) return;
    const userData = {...user};
    const {name, phoneNumber, address, bio} = userData;
    const id = currentUser?.id as string;
    const imageUri = userData.image as string;

    if (!name || !phoneNumber || !address || !bio) {
      Alert.alert('Profile', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    if (isImageChanging) {
      const imageRes = await uploadFile('profiles', imageUri, true);
      if (imageRes.success) {
        userData.image = imageRes.data;
      } else {
        userData.image = currentUser?.image ?? null;
      }
    }

    const res = await updateUser(id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({...currentUser, ...userData});
      router.back();
    }
  };

  const imageSource =
    user?.image && isImageChanging
      ? user.image
      : getUserImageSrc(currentUser?.image);

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <ScrollView style={{flex: 1}}>
          <Header title="Edit Profile" />
          {/* form */}
          <View style={styles.form}>
            {/* avatar */}
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="cameraIcon" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>
            {/* Text */}
            <Text
              style={{
                fontSize: heightPercentage(1.5),
                color: theme.colors.text,
              }}
            >
              Please fill your profile details
            </Text>
            {/* username */}
            <Input
              icon={<Icon name="userIcon" />}
              placeholder="Enter your name"
              value={user?.name}
              onChangeText={(value) => setUser({...user, name: value})}
            />

            {/* phoneNumber */}
            <Input
              icon={<Icon name="callIcon" />}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={user?.phoneNumber}
              onChangeText={(value) => setUser({...user, phoneNumber: value})}
            />

            {/* address */}
            <Input
              icon={<Icon name="locationIcon" />}
              placeholder="Enter your address"
              value={user?.address}
              onChangeText={(value) => setUser({...user, address: value})}
            />

            {/* bio */}
            <Input
              placeholder="Enter your bio"
              value={user?.bio}
              containerStyles={styles.bio}
              onChangeText={(value) => setUser({...user, bio: value})}
            />

            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercentage(4),
  },
  avatarContainer: {
    height: heightPercentage(14),
    width: heightPercentage(14),
    alignSelf: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: theme.colors.textLight,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: 'row',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: 'row',
    height: heightPercentage(15),
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
});
