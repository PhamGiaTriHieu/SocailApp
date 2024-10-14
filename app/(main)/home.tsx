import React, {useState} from 'react';
import {Text} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import Button from '@/components/Button';

import {supabase} from '@/lib/supabase';
import {useAuth} from '@/contexts/AuthContext';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const {setAuth} = useAuth();
  const onLogout = async () => {
    setLoading(true);
    setAuth(null);
    const {error} = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      setLoading(false);
      console.log('signOut error: ', error);
    }
  };
  return (
    <ScreenWrapper>
      <Text>Home</Text>
      <Button loading={loading} title="Logout" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default Home;
