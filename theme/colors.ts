import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(249, 249, 249)',
    grey5: 'rgb(239, 239, 239)',
    grey4: 'rgb(228, 229, 228)',
    grey3: 'rgb(213, 214, 213)',
    grey2: 'rgb(182, 183, 182)',
    grey: 'rgb(161, 163, 161)',
    background: 'rgb(248, 248, 248)',
    foreground: 'rgb(3, 3, 3)',
    root: 'rgb(248, 248, 248)',
    card: 'rgb(248, 248, 248)',
    destructive: 'rgb(255, 56, 43)',
    primary: 'rgb(123, 171, 126)',
  },
  dark: {
    grey6: 'rgb(28, 28, 28)',
    grey5: 'rgb(46, 47, 46)',
    grey4: 'rgb(59, 60, 59)',
    grey3: 'rgb(79, 81, 79)',
    grey2: 'rgb(122, 124, 122)',
    grey: 'rgb(160, 162, 160)',
    background: 'rgb(1, 2, 1)',
    foreground: 'rgb(251, 253, 251)',
    root: 'rgb(1, 2, 1)',
    card: 'rgb(1, 2, 1)',
    destructive: 'rgb(254, 67, 54)',
    primary: 'rgb(123, 171, 126)',
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(250, 252, 255)',
    grey5: 'rgb(243, 247, 251)',
    grey4: 'rgb(236, 242, 248)',
    grey3: 'rgb(233, 239, 247)',
    grey2: 'rgb(229, 237, 245)',
    grey: 'rgb(226, 234, 243)',
    background: 'rgb(250, 252, 255)',
    foreground: 'rgb(27, 28, 29)',
    root: 'rgb(250, 252, 255)',
    card: 'rgb(250, 252, 255)',
    destructive: 'rgb(186, 26, 26)',
    primary: 'rgb(0, 112, 233)',
  },
  dark: {
    grey6: 'rgb(25, 30, 36)',
    grey5: 'rgb(31, 38, 45)',
    grey4: 'rgb(35, 43, 52)',
    grey3: 'rgb(38, 48, 59)',
    grey2: 'rgb(40, 51, 62)',
    grey: 'rgb(44, 56, 68)',
    background: 'rgb(24, 28, 32)',
    foreground: 'rgb(221, 227, 233)',
    root: 'rgb(24, 28, 32)',
    card: 'rgb(24, 28, 32)',
    destructive: 'rgb(147, 0, 10)',
    primary: 'rgb(0, 69, 148)',
  },
} as const;

const WEB_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(250, 252, 255)',
    grey5: 'rgb(243, 247, 251)',
    grey4: 'rgb(236, 242, 248)',
    grey3: 'rgb(233, 239, 247)',
    grey2: 'rgb(229, 237, 245)',
    grey: 'rgb(226, 234, 243)',
    background: 'rgb(250, 252, 255)',
    foreground: 'rgb(27, 28, 29)',
    root: 'rgb(250, 252, 255)',
    card: 'rgb(250, 252, 255)',
    destructive: 'rgb(186, 26, 26)',
    primary: 'rgb(0, 112, 233)',
  },
  dark: {
    grey6: 'rgb(25, 30, 36)',
    grey5: 'rgb(31, 38, 45)',
    grey4: 'rgb(35, 43, 52)',
    grey3: 'rgb(38, 48, 59)',
    grey2: 'rgb(40, 51, 62)',
    grey: 'rgb(44, 56, 68)',
    background: 'rgb(24, 28, 32)',
    foreground: 'rgb(221, 227, 233)',
    root: 'rgb(24, 28, 32)',
    card: 'rgb(24, 28, 32)',
    destructive: 'rgb(147, 0, 10)',
    primary: 'rgb(0, 69, 148)',
  },
} as const;

const COLORS =
  Platform.OS === 'ios'
    ? IOS_SYSTEM_COLORS
    : Platform.OS === 'android'
      ? ANDROID_COLORS
      : WEB_COLORS;

export { COLORS };
