import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  // TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEventListener,
} from 'react-native';
import {theme} from '@/constants/theme';
import {heightPercentage} from '@/helpers/commom';

interface IInputProps extends TextInputProps {
  containerStyles?: object;
  icon?: React.ReactNode | React.JSX.Element;
  iconEnd?: React.ReactNode | React.JSX.Element;
  inputRef?: React.RefObject<TextInput>;
}

const Input = ({
  containerStyles,
  icon,
  iconEnd,
  inputRef,
  ...rest
}: IInputProps) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow
    );

    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardShow
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleKeyboardShow: KeyboardEventListener = (event) => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide: KeyboardEventListener = (event) => {
    setIsKeyboardVisible(false);
  };
  return (
    <View style={[styles.container, containerStyles && containerStyles]}>
      {icon ? icon : null}
      <TextInput
        style={{flex: 1}}
        placeholderTextColor={theme.colors.textLight}
        ref={inputRef}
        {...rest}
      />

      {iconEnd ? iconEnd : null}
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
