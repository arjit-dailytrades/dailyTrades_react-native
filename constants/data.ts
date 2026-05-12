export const segmentOptions = [
  { label: "Equity", value: "EQ" },
  { label: "Future", value: "FU" },
  { label: "Option", value: "OPT" },
];

export const typeOptions = [
  { label: "BTST", value: "BTST" },
  { label: "Intraday", value: "INTRADAY" },
  { label: "Positional", value: "POSITIONAL" },
  { label: "STBT", value: "STBT" },
  { label: "LONGTERM", value: "LONGTERM" },
];

export const priceOption = [
  { label: "Free", value: "FREE" },
  { label: "Paid", value: "PAID" },
];

export const filterOptions = [
  { label: "All", value: "" },
  { label: "Current Month", value: "current_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

export const TAB_OPTIONS = [
  "Past Performance",
  "Regulatory Disclosures",
  "Investor Charter",
  "User Agreement",
  "Disclosure",
];

export const PAST_PERFORMANCE_TAB = "Past Performance";

interface SegmentMapping {
  [key: string]: string;
}
export const segmentMapping: SegmentMapping = {
  EQ: "Equity",
  FU: "Future",
  OPT: "Option",
};

interface AdvisorMapping {
  [key: string]: string;
}
export const statusMapping: AdvisorMapping = {
  EXPIRED: "TRADE EXPIRED",
  TARGET_MET: "TARGET HIT",
  STOP_LOSS_MET: "STOP LOSS HIT",
};
