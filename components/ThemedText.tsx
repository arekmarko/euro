import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'boldNumber' | 'light';
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
    fontSize: 14,
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
    fontSize: 16,
    color: '#0a7ea4',
  },
  boldNumber : {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Exo2V'
  }
});
