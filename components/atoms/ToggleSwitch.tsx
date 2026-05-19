import React from "react";
import { Switch } from "react-native";

interface ToggleSwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value = false,
  onValueChange,
  disabled = false,
  activeColor = "#2563eb",
}) => {
  return (
    <Switch
      value={value}
      disabled={disabled}
      onValueChange={onValueChange}
      trackColor={{
        false: "#D1D1D6",
        true: activeColor,
      }}
      thumbColor="#FFFFFF"
      //   ios_backgroundColor="#D1D1D6"
    />
  );
};

export default ToggleSwitch;
