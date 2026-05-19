import NotificationCardHeader from "@/components/molecules/NotificationCardHeader";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Notification } from "@/types/notification";
import React, { useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import NotificationCardBody from "../molecules/NotificationCardBody";

interface NotificationCardProps {
  item: Notification;
  onPress?: (item: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onPress,
}) => {
  const theme = useAppTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();
  };

  const { data, isRead, createdAt, body } = item;
  const { advisorName } = data;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress?.(item)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.cardContainer,
          {
            backgroundColor: isRead ? theme.cardColor : theme.boxBg,
            borderColor: isRead ? theme.borderColor : theme.primary + "40",
          },
        ]}
      >
        <View style={styles.content}>
          <NotificationCardHeader
            advisorName={advisorName}
            isRead={isRead}
            createdAt={createdAt}
          />
          <NotificationCardBody body={body} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
  },
  content: {
    flex: 1,
    padding: 14,
  },
});

export default NotificationCard;
