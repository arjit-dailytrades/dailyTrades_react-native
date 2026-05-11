import { useAppTheme } from "@/hooks/use-app-theme";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const TradeCardBody = ({ item, earnProfit }: any) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.details, { backgroundColor: theme.detailBg }]}>
      {/* Symbol row */}
      <View style={styles.rowBetween}>
        <View>
          {item?.openedScript ? (
            <Text style={[styles.symbol, { color: theme.textColor }]}>
              {item?.title}
            </Text>
          ) : (
            <Image
              source={require("../../assets/images/scriptBlur.png")}
              style={{ height: 35, width: 100 }}
              contentFit="cover"
            />
          )}
        </View>

        <View style={styles.rightTop}>
          <TouchableOpacity
            style={[styles.chatBtn, { borderColor: theme.chatBtnBorder }]}
          >
            <AntDesign name="wechat-work" size={12} color={theme.textColor} />
            <Text style={[styles.chatText, { color: theme.textColor }]}>
              Chat
            </Text>
          </TouchableOpacity>

          <Feather name="info" size={16} color={theme.textColor} />
        </View>
      </View>

      {/* Entry / SL / Target */}
      <View style={styles.row}>
        <Box
          label={item?.openedScript ? "Entry" : "EXP Margin"}
          value={item?.openedScript ? `₹${item.entryMin}-${item.entryMax}` : ""}
          theme={theme}
          height={96}
          direction="column"
          justify="center"
          labelSize={16}
        />

        <View style={styles.sideColumn}>
          <Box
            label="Stop Loss"
            value={`₹${item.stopLoss}`}
            theme={theme}
            height={43}
            direction="row"
            justify="space-between"
            labelSize={12}
          />
          <Box
            label="Target"
            value={`₹${item.target}`}
            theme={theme}
            height={43}
            direction="row"
            justify="space-between"
            labelSize={12}
          />
        </View>
      </View>

      {/* Profit */}
      <Text style={styles.profit}>
        <AntDesign name="line-chart" size={16} color="#3EBE32" /> Potential
        Return {earnProfit?.toFixed(2)}%
      </Text>
    </View>
  );
};

export default TradeCardBody;

function Box({
  label,
  value,
  theme,
  height,
  direction,
  justify,
  labelSize,
}: any) {
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: theme.boxBg,
          height,
          flexDirection: direction,
          justifyContent: justify,
        },
      ]}
    >
      <Text
        style={[styles.boxLabel, { color: theme.subText, fontSize: labelSize }]}
      >
        {label}
      </Text>
      <Text
        style={[styles.boxValue, { color: theme.valColor }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rightTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  chatBtn: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  chatText: {
    fontSize: 10,
    fontWeight: "600",
  },

  symbol: {
    fontSize: 14,
    fontWeight: "800",
  },

  row: {
    flexDirection: "row",
    marginTop: 18,
    gap: 8,
  },

  sideColumn: {
    flex: 1,
    gap: 10,
  },

  box: {
    flex: 1,
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
  },

  boxLabel: {
    fontWeight: "500",
  },

  boxValue: {
    fontSize: 11,
    fontWeight: "500",
  },

  profit: {
    color: "#3EBE32",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
});
