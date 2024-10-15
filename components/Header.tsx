import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRouter} from 'expo-router';
import BackButton from '@/components/BackButton';
import {heightPercentage} from '@/helpers/commom';
import {theme} from '@/constants/theme';

interface IHeaderProps {
  title: string;
  showBackButton?: boolean;
  mb?: number;
}
const Header = ({title, showBackButton = true, mb = 10}: IHeaderProps) => {
  const router = useRouter();
  return (
    <View style={[styles.container, {marginBottom: mb}]}>
      {showBackButton && (
        <View style={styles.showBackButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text style={styles.title}>{title ?? ''}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  showBackButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    fontSize: heightPercentage(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
});
