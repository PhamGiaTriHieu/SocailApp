import {View, Text, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {theme} from '@/constants/theme';
import {heightPercentage} from '@/helpers/commom';
import Loading from '@/components/Loading';

interface IButtonProps {
  buttonStyle?: object;
  textStyle?: object;
  title: string;
  onPress: () => void;
  loading?: boolean;
  hasShadow?: boolean;
}

const Button = ({
  title,
  buttonStyle,
  textStyle,
  hasShadow = true,
  loading = false,
  onPress,
}: IButtonProps) => {   
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: {with: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: heightPercentage(6.6),
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius.xl,
  },
  text: {
    fontSize: heightPercentage(2.5),
    color: 'white',
    fontWeight: theme.fonts.bold,
  },
});
