import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from '@/assets/icons';
import {theme} from '@/constants/theme';
import {useRouter, Router} from 'expo-router';

interface IBackButtonProps {
  size?: number;
  router?: Router;
}

const BackButton = ({size = 26, router}: IBackButtonProps) => {
  return (
    <Pressable onPress={() => router?.back()} style={styles.button}>
      <Icon
        name="arrowLeftIcon"
        strokeWidth={2.5}
        size={size}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
  },
});
