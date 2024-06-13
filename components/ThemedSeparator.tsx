import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { type ViewProps, StyleSheet, Text, View, useColorScheme } from "react-native";

export type ThemedSeparatorProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSeparator({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedSeparatorProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "separator"
  );
  return <View style={[{ backgroundColor }, styles.separator, style]} {...rest}></View>;
}
const styles = StyleSheet.create({
  separator: {
    height: 1,
    width:'100%',
    alignSelf: "center",
    margin: 10,
  },
});
