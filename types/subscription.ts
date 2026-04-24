export interface SubscriptionRecord {
  _id: string;
  isExpired: boolean;
  plan: string;
  trades: {
    total: number;
    balance: number;
  };
  validUpTo: string;
  advisor: {
    fName: string;
    lName: string;
    dp: string;
    accuracy: number;
    rType: string;
    rNo: string;
  };
}
