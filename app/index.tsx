import React from 'react';
import {View, Text, Button} from 'react-native';
import {useRouter} from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Welcome from '@/app/welcome';
import Loading from '@/components/Loading';

const index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Loading />
      </View>
      <Welcome />
    </ScreenWrapper>
  );
};

export default index;
