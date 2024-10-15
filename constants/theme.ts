type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 'normal'
  | 'bold'
  | 'ultralight'
  | 'thin'
  | 'light'
  | 'medium'
  | 'black';

interface ITheme {
  colors: {
    primary: string;
    primaryDark: string;
    dark: string;
    darkLight: string;
    gray: string;
    text: string;
    textLight: string;
    textDark: string;
    rose: string;
    roseLight: string;
    backgroundLogoutColor: string;
  };
  fonts: {
    medium: FontWeight;
    semibold: FontWeight;
    bold: FontWeight;
    extraBold: FontWeight;
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export const theme: ITheme = {
  colors: {
    primary: '#00C26F',
    primaryDark: '#00AC62',
    dark: '#3E3E3E',
    darkLight: '#E1E1E1',
    gray: '#e3e3e3',
    text: '#494949',
    textLight: '#7C7C7C',
    textDark: '#1D1D1D',
    rose: '#ef4444',
    roseLight: '#f87171',
    backgroundLogoutColor: '#fee2e2',
  },
  fonts: {
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
  },
};
