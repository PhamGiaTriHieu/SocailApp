import {View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IScreenWrapperProps {
  children: React.ReactNode;
  bg?: string;
}

const ScreenWrapper = ({children, bg}: IScreenWrapperProps) => {
  const {top} = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;

  return (
    <View style={{flex: 1, paddingTop: paddingTop, backgroundColor: bg}}>
      {children}
    </View>
  );
};

export default ScreenWrapper;
