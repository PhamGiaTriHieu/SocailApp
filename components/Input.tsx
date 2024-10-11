import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {theme} from '@/constants/theme';
import {heightPercentage} from '@/helpers/commom';

interface IInputProps extends TextInputProps {
  containerStyles?: object;
  icon?: React.ReactNode | React.JSX.Element;
  inputRef?: React.RefObject<TextInput>;
}

const Input = ({containerStyles, icon, inputRef, ...rest}: IInputProps) => {
  return (
    <View style={[styles.container, containerStyles && containerStyles]}>
      {icon ? icon : null}
      <TextInput
        style={{flex: 1}}
        placeholderTextColor={theme.colors.textLight}
        ref={inputRef}
        {...rest}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: heightPercentage(7.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    gap: 12,
  },
});
