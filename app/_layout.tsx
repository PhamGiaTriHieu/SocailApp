import {View, Text, LogBox} from 'react-native';
import React, {useEffect} from 'react';
import {Stack, useRouter} from 'expo-router';
import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import {supabase} from '@/lib/supabase';
import {getUserData} from '@/services/userService';

LogBox.ignoreLogs([
  'Warning: TNodeChildrenRenderer',
  'Warning: MemoizedTNodeRenderer',
  'Warning: TRenderEngineProvider',
]); // Ignore log errors for now

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const {setAuth, setUserData} = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Go to home screen
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace('/home');
      } else {
        // setAuth(null);
        // Move to welcome screen
        setAuth(null);
        router.replace('/welcome');
      }
    });
  }, []);

  const updateUserData = async (user: any, email: string | undefined) => {
    const res = await getUserData(user?.id);
    if (res.success) setUserData({...res.data, email});
  };

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="(main)/postDetails"
        options={{presentation: 'modal'}}
      />
    </Stack>
  );
};

export default _layout;
