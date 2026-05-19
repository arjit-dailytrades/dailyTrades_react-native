import ToggleRow from "@/components/molecules/ToggleRow";
import { StyleSheet, View } from "react-native";
import SectionTitle from "../atoms/SectionTitle";

interface GeneralSettings {
  muted: boolean;
  partialExit: boolean;
  advisorMsg: boolean;
  newsletter: boolean;
}

const NOTIFICATION_ROWS: {
  label: string;
  field: keyof GeneralSettings;
  invert?: boolean;
}[] = [
  { label: "All Notifications", field: "muted", invert: true },
  { label: "Partial Exit", field: "partialExit" },
  { label: "Advisor Chat", field: "advisorMsg" },
  { label: "Newsletter", field: "newsletter" },
];

interface NotificationSettingSectionProps {
  generalSettings: GeneralSettings;
  onToggle: (field: keyof GeneralSettings, value: boolean) => void;
  theme: Record<string, string>;
}

export default function NotificationSettingSection({
  generalSettings,
  onToggle,
  theme,
}: NotificationSettingSectionProps) {
  return (
    <>
      <SectionTitle label="NOTIFICATION SETTING" theme={theme} />
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        {NOTIFICATION_ROWS.map(({ label, field, invert }, i, arr) => (
          <ToggleRow
            key={field}
            label={label}
            value={invert ? !generalSettings[field] : generalSettings[field]}
            onChange={(v) => onToggle(field, invert ? !v : v)}
            isLast={i === arr.length - 1}
          />
        ))}
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
