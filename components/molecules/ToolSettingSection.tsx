import ToggleRow from "@/components/molecules/ToggleRow";
import { StyleSheet, View } from "react-native";
import SectionTitle from "../atoms/SectionTitle";

interface ToolSettingSectionProps {
  isEnable: boolean;
  toolLoading: boolean;
  onToggleTool: (value: boolean) => void;
  theme: Record<string, string>;
}

export default function ToolSettingSection({
  isEnable,
  toolLoading,
  onToggleTool,
  theme,
}: ToolSettingSectionProps) {
  return (
    <>
      <SectionTitle label="TOOL SETTING" theme={theme} />
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <ToggleRow
          label="Quantity tool Active"
          value={isEnable}
          onChange={onToggleTool}
          disabled={toolLoading}
          isLast
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
