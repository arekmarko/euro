import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'boldNumber' | 'light' | 'error';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'boldNumber' ? styles.boldNumber : undefined,
        type === 'light' ? styles.light : undefined,
        type === 'error' ? styles.error : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: 'Exo2V'
  },
  light: {
    fontSize: 10,
    fontFamily: 'Exo2V'
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Exo2V'
  },
  title: {
    fontSize: 36,
    fontFamily: 'Exo2V'
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Exo2V'
  },
  link: {
    lineHeight: 30,
    fontSize: 18,
    color: Colors.darkblue,
  },
  boldNumber : {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Exo2V'
  },
  error: {
    fontSize: 16,
    fontFamily: 'Exo2V',
    color: '#ff0000'
  }
});
