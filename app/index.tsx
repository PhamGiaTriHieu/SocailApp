import React from 'react';
import {View, Text, Button} from 'react-native';
import {useRouter} from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import Welcome from '@/app/welcome';

const index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      {/* <Text>index</Text>
      <Button title="Welcome" onPress={() => router.push('/welcome')} /> */}
      <Welcome />
    </ScreenWrapper>
  );
};

export default index;
