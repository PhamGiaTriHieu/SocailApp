import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import ScreenWrapper from '@/components/ScreenWrapper';
import {theme} from '@/constants/theme';
import Icon from '@/assets/icons';
import {StatusBar} from 'expo-status-bar';

import {useRouter} from 'expo-router';
import {heightPercentage, widthPercentage} from '@/helpers/commom';

import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import Input from '@/components/Input';

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef('');
  // const password = useRef('');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const onSubmit = () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />
        {/* Welcome */}
        <View>
          <Text style={styles.welcomeText}>Let's,</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>
        {/* Form */}
        <View style={styles.form}>
          <Text
            style={{fontSize: heightPercentage(1.5), color: theme.colors.text}}
          >
            Please fill the details to create an account
          </Text>
          {/* name */}
          <Input
            icon={<Icon name="userIcon" size={26} strokeWidth={1.6} />}
            placeholder="Enter your name"
            onChangeText={(value) => {
              setName(value);
            }}
          />

          {/* email */}
          <Input
            icon={<Icon name="mailIcon" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => {
              setEmail(value);
            }}
          />

          {/* password */}
          <Input
            icon={<Icon name="lockIcon" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={!showPassword}
            iconEnd={
              showPassword ? (
                <Pressable onPress={() => setShowPassword(false)}>
                  <Icon name="eyeOnIcon" size={26} />
                </Pressable>
              ) : (
                <Pressable>
                  <Icon
                    name="eyeOffIcon"
                    size={26}
                    onPress={() => setShowPassword(true)}
                  />
                </Pressable>
              )
            }
          />

          {/* password Confirm */}
          <Input
            icon={<Icon name="lockIcon" size={26} strokeWidth={1.6} />}
            placeholder="Enter your confirm password"
            onChangeText={(value) => setPasswordConfirm(value)}
            secureTextEntry={!showPasswordConfirm}
            iconEnd={
              showPasswordConfirm ? (
                <Pressable onPress={() => setShowPasswordConfirm(false)}>
                  <Icon name="eyeOnIcon" size={26} />
                </Pressable>
              ) : (
                <Pressable>
                  <Icon
                    name="eyeOffIcon"
                    size={26}
                    onPress={() => setShowPasswordConfirm(true)}
                  />
                </Pressable>
              )
            }
          />

          {/* button */}
          <Button
            title="Sign Up"
            loading={loading}
            onPress={() => onSubmit()}
          />
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: widthPercentage(5),
  },
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

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    alignItems: 'center',
    fontSize: heightPercentage(1.6),
    color: theme.colors.text,
  },
});
