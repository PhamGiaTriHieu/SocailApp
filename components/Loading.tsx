import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {theme} from '@/constants/theme';

interface ILoadingProps {
  size?: 'large' | 'small';
  color?: string;
}

const Loading = ({color = theme.colors.primary, size}: ILoadingProps) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
