import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Image} from 'expo-image';
import {heightPercentage} from '@/helpers/commom';
import {theme} from '@/constants/theme';
import {getUserImageSrc} from '@/services/imageService';

interface IAvatarProps {
  uri?: string | null | undefined;
  size?: number;
  rounded?: number;
  style?: object;
}

const Avatar = ({
  size = heightPercentage(4.5),
  uri,
  rounded = theme.radius.md,
  style = {},
}: IAvatarProps) => {
  return (
    <Image
      source={getUserImageSrc(uri)}
      transition={100}
      style={[
        styles.avatar,
        {height: size, width: size, borderRadius: rounded},
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
