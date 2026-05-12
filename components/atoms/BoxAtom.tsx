import { useAppTheme } from "@/hooks/use-app-theme";
import { StyleSheet, Text, View } from "react-native";

export const BoxAtom = ({
  label,
  value,
  valueColor,
  type = "default",
}: {
  label: string;
  value: string;
  valueColor?: string;
  type?: string;
}) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.box]}>
      <Text style={[styles.label, { color: theme.subText }]}>{label}</Text>
      <Text
        style={[
          styles.value,
          {
            backgroundColor: theme.innerBox ?? theme.glassBorder,
            color: valueColor ?? theme.textColor,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    textAlign: "center",
    flexShrink: 1,
    maxWidth: "100%",
  },
});
