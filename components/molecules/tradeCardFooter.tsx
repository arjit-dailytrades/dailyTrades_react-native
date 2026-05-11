import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { downloadResearchReport } from "@/redux/slice/expertSlice";
import { AppDispatch, RootState } from "@/redux/store";

import CommonButton from "../common/CommonButton";
import GlowButton from "../common/GlowButton";

const TradeCardFooter = ({ item, onUnlock }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDownloading } = useSelector((state: RootState) => state.expert);

  const advisor = item?.advisor;

  return (
    <View style={styles.bottom}>
      <CommonButton
        title={isDownloading ? "Downloading..." : "Research Report"}
        buttonWidth={110}
        handleClick={() =>
          dispatch(
            downloadResearchReport({
              id: item.id,
              advisor,
              record: item,
            }),
          )
        }
      />

      <GlowButton
        title={
          !item?.openedScript
            ? "Open"
            : !advisor?.isSubscribed
              ? "Subscribe"
              : "Place Order"
        }
        buttonWidth={110}
        handleClick={() => onUnlock(item)}
      />
    </View>
  );
};

export default memo(TradeCardFooter);

const styles = StyleSheet.create({
  bottom: {
    flexDirection: "row",
    marginTop: 18,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});
