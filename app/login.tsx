import React from 'react';
import {View, Text} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import {theme} from '@/constants/theme';
import Icon from '@/assets/icons';

const Login = () => {
  return (
    <ScreenWrapper>
      <Text>Login</Text>
      <Icon name="home" />
    </ScreenWrapper>
  );
};

export default Login;
