import {ExpoConfig, ConfigContext} from 'expo/config';

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'social-app',
  name: 'Social App',
});
