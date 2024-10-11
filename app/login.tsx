import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import {theme} from '@/constants/theme';
import Icon from '@/assets/icons';
import {StatusBar} from 'expo-status-bar';

import {useRouter} from 'expo-router';
import {heightPercentage, widthPercentage} from '@/helpers/commom';

import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import Input from '@/components/Input';

const Login = () => {
  const router = useRouter();
  const emailRef = useRef('');
  // const password = useRef('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {};

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* Welcome */}
        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text
            style={{fontSize: heightPercentage(1.5), color: theme.colors.text}}
          >
            Please Login to continue
          </Text>
          {/* email */}
          <Input
            icon={<Icon name="mailIcon" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => {
              setEmail(value);
              emailRef.current = value;
            }}
          />
          {/* password */}
          <Input
            icon={<Icon name="lockIcon" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={(value) => console.log('password', value)}
            secureTextEntry={true}
          />

          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          {/* button */}
          <Button
            title="Loading"
            loading={loading}
            onPress={() => console.log('clicked login')}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: widthPercentage(5),
  },

  // welcomeImage: {
  //   height: heightPercentage(30),
  //   width: widthPercentage(100),
  //   alignSelf: 'center',
  // },
  welcomeText: {
    fontSize: heightPercentage(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  // punchline: {
  //   textAlign: 'center',
  //   paddingHorizontal: widthPercentage(10),
  //   fontSize: heightPercentage(1.7),
  //   color: theme.colors.text,
  // },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {},
  // bottomTextContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   gap: 5,
  // },
  // loginText: {
  //   textAlign: 'center',
  //   color: theme.colors.text,
  //   fontSize: heightPercentage(1.6),
  // },
});
