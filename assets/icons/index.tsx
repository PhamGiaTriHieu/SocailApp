import {StyleSheet, Text, View} from 'react-native';
import React, {ReactDOM} from 'react';
import HomeIcon from '@/assets/icons/HomeIcon';
import {SvgProps} from 'react-native-svg';
import {theme} from '@/constants/theme';

interface IIconProps extends SvgProps {
  name: React.JSX.Element | React.ReactNode;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const icons = {
  home: HomeIcon,
};

const Icon = ({name, size, strokeWidth, color, ...rest}: IIconProps) => {
  const IconComponent = icons[name as keyof typeof icons];

  return (
    <IconComponent
      height={size || 24}
      width={size || 24}
      strokeWidth={strokeWidth || 1.9}
      color={theme.colors.textLight}
      {...rest}
    />
  );
};

export default Icon;

const styles = StyleSheet.create({});
