import { fetchScripts } from "@/redux/slice/scriptSlice";
import { AppDispatch } from "@/redux/store";
import { showError, showSuccess } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useDispatch } from "react-redux";

interface Props {
  advisor: any;
  handleSelectPlan: (id: string | null) => void;
  selectedPlan: string | null;
}

export default function SubscriptionPlan({
  advisor,
  handleSelectPlan,
  selectedPlan,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [loading, setLoading] = useState(false);
  const [showEasebuzzModal, setShowEasebuzzModal] = useState(false);
  const [easebuzzUrl, setEasebuzzUrl] = useState("");
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const handleClose = () => {
    setLoading(false);
  };
  const advisorSubscription = [
    {
      id: "monthly",
      name: "Monthly",
      subscriptionId: advisor?.advisorSubscriptions?._id,
      price: advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.price,
      trades: advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.trades,
      sTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.sTotalAmount,
      sNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.sNetAmount,
      sGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.sGstAmount,
      pTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.pTotalAmount,
      pNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.pNetAmount,
      pGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.pGstAmount,
      finalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.monthly?.finalAmount,
      savings: "",
      advisor: {
        name: `${advisor?.fName} ${advisor?.lName}`,
        accuracy: advisor?.accuracy,
        rating: "",
        regNumber: advisor?.rNo,
      },
    },
    {
      id: "quarterly",
      name: "Quarterly",
      subscriptionId: advisor?.advisorSubscriptions?._id,
      price: advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly?.price,
      sTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly
          ?.sTotalAmount,
      sNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly?.sNetAmount,
      sGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly?.sGstAmount,
      pTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly
          ?.pTotalAmount,
      pNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly?.pNetAmount,
      pGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly?.pGstAmount,
      finalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly
          ?.finalAmount,
      trades:
        advisor?.advisorSubscriptions?.subscriptionPlans?.quarterly?.trades,
      savings: "",
      advisor: {
        name: `${advisor?.fName} ${advisor?.lName}`,
        accuracy: advisor?.accuracy,
        rating: "",
        regNumber: advisor?.rNo,
      },
    },
    {
      id: "sixMonths",
      name: "Half-Yearly",
      subscriptionId: advisor?.advisorSubscriptions?._id,
      price: advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths?.price,
      trades:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths?.trades,
      sTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths
          ?.sTotalAmount,
      sNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths?.sNetAmount,
      sGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths?.sGstAmount,
      pTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths
          ?.pTotalAmount,
      pNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths?.pNetAmount,
      pGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths?.pGstAmount,
      finalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.sixMonths
          ?.finalAmount,
      savings: "",
      advisor: {
        name: `${advisor?.fName} ${advisor?.lName}`,
        accuracy: advisor?.accuracy,
        rating: "",
        regNumber: advisor?.rNo,
      },
    },
    {
      id: "annual",
      name: "Yearly",
      subscriptionId: advisor?.advisorSubscriptions?._id,
      price: advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.price,
      trades: advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.trades,
      sTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.sTotalAmount,
      sNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.sNetAmount,
      sGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.sGstAmount,
      pTotalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.pTotalAmount,
      pNetAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.pNetAmount,
      pGstAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.pGstAmount,
      finalAmount:
        advisor?.advisorSubscriptions?.subscriptionPlans?.annual?.finalAmount,
      savings: "", // Add savings logic if needed
      advisor: {
        name: `${advisor?.fName} ${advisor?.lName}`,
        accuracy: advisor?.accuracy,
        rating: "",
        regNumber: advisor?.rNo,
      },
    },
  ];

  // Razorpay
  const handleRazorpay = async (order: any) => {
    if (!order.orderId) {
      showError("Order failed please try again");
      return;
    }
    const options = {
      description: "Subscription",
      currency: order.currency,
      key: process.env.EXPO_PUBLIC_RAZORPAY_KEY || "",
      amount: order.amount,
      name: order.firmName,
      order_id: order.id,
      prefill: {
        contact: order.notes?.mobile || "",
      },
      theme: { color: "#7c3aed" },
    };

    try {
      const response = await RazorpayCheckout.open(options);
      await verifyPayment(response, order, "razorpay");
    } catch (error: any) {
      await verifyPayment({ razorpay_order_id: null }, order, "razorpay");
    }
  };

  // Easebuzz
  const handleEasebuzz = (order: any) => {
    if (!order.orderId) {
      showError("Order failed please try again");
      return;
    }
    const env = order.easebuzzEnv === "prod" ? "pay" : "testpay";
    const url = `https://${env}.easebuzz.in/pay/${order.data}`;
    console.log("env:", env);
    console.log("url", url);

    setCurrentOrder(order);
    setEasebuzzUrl(url);
    setShowEasebuzzModal(true);
  };

  const getQueryParams = (url: string) => {
    const params: any = {};
    const queryPart = url.split("?")[1];
    if (queryPart) {
      queryPart.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
      });
    }
    return params;
  };

  // Easybuzz navigation
  const handleEasebuzzNavigation = (state: any) => {
    const { url } = state;
    console.log("Current Navigation URL:", url);

    const isResponsePage =
      url.includes("response") ||
      url.includes("callback") ||
      url.includes("verify-payment");

    if (isResponsePage) {
      setLoading(true);

      setShowEasebuzzModal(false);

      const params = getQueryParams(url);
      const paymentStatus = params.status || "SUCCESS";

      verifyPayment(
        { status: paymentStatus, ...params },
        currentOrder,
        "easebuzz",
      );
    }
  };

  // Verify Payment
  const verifyPayment = async (response: any, order: any, gateway: string) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("t");
      const selectedPlanObj = advisorSubscription.find(
        (p) => p.id === selectedPlan,
      );

      const payload =
        gateway === "razorpay"
          ? {
              status: response?.razorpay_order_id ? "SUCCESS" : "DECLINE",
              receipt: order.receipt,
              transactionId: order.transactionId,
              razorpay_order_id: response?.razorpay_order_id || "none",
              razorpay_payment_id: response?.razorpay_payment_id || "none",
              razorpay_signature: response?.razorpay_signature || "none",
              plan: selectedPlanObj?.id,
              advisorId: advisor.id || advisor._id,
              subscriptionId: advisor.advisorSubscriptions._id,
            }
          : {
              // Easebuzz specific payload
              status:
                response?.status === "userCancelled" ||
                response?.status === "failure"
                  ? "DECLINE"
                  : "SUCCESS",
              receipt: order.data,
              transactionId: order.transactionId,
              plan: selectedPlanObj?.id,
              advisorId: advisor.id || advisor._id,
              subscriptionId: advisor.advisorSubscriptions._id,
              orderId: order.orderId,
            };

      const verifyRes = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/advisor/subscribe-advisor/${gateway}/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await verifyRes.json();

      if (verifyRes.ok && (data.transactionId || data.success)) {
        dispatch(fetchScripts({ page: 1 }));
        showSuccess(data.message || "Subscription Successful!");
        handleClose();
      } else {
        showError(data.message || "Payment verification failed on server.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Verification Error:", error);
      showError("Network error while verifying payment");
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (advisor.isSubscribed) {
      showError("Already subscribed!");
      return;
    }
    if (!selectedPlan) return showError("Please select a plan");

    setLoading(true);
    const token = await AsyncStorage.getItem("t");
    const gateway = advisor?.advisorSubscriptions?.paymentGateway || "razorpay";

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE}/advisor/subscribe-advisor/${gateway}/create-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            advisorId: advisor.id || advisor._id,
            subscriptionId: advisor.advisorSubscriptions?._id,
            plan: selectedPlan,
          }),
        },
      );

      const order = await response.json();
      console.log("order:", order);

      if (gateway === "razorpay") {
        handleRazorpay(order);
      } else {
        handleEasebuzz(order);
      }
    } catch (error) {
      showError("Failed to initiate payment");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.content}>
      {advisorSubscription.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[styles.plan, selectedPlan === plan.id && styles.planActive]}
          onPress={() => handleSelectPlan(plan.id)}
        >
          <View>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>₹{plan.price || 0}</Text>
          </View>

          <View
            style={[
              styles.radio,
              selectedPlan === plan.id && styles.radioActive,
            ]}
          />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={handleSubscribe}
        disabled={loading || !selectedPlan}
        activeOpacity={0.7}
        style={[
          styles.paymentBtn,
          (loading || !selectedPlan) && styles.paymentBtnDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.btnText}>Proceed to Payment</Text>
        )}
      </TouchableOpacity>
      {/* Easebuzz WebView Modal */}
      <Modal visible={showEasebuzzModal} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <WebView
            source={{ uri: easebuzzUrl }}
            onNavigationStateChange={handleEasebuzzNavigation}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },

  plan: {
    borderWidth: 1.5,
    borderColor: "#eee",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planActive: {
    borderColor: "#3b6edc",
    backgroundColor: "#f0f4ff",
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  planPrice: {
    fontSize: 14,
    color: "#3b6edc",
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  radioActive: {
    borderColor: "#3b6edc",
    backgroundColor: "#3b6edc",
  },

  paymentBtn: {
    height: 40,
    borderRadius: 30,
    backgroundColor: "#2F6FED",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  paymentBtnDisabled: {
    backgroundColor: "#A0A0A0",
  },

  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
