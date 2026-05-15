import { apiRequest } from "@/apiInstance";
import { setUser } from "@/redux/slice/authSlice";
import { store } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode, encode } from "base-64";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export const getUpdatedProfile = async (user: any) => {
  try {
    const token = await AsyncStorage.getItem("t");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${API_BASE}/auth/profile`, requestOptions)
      .then((res) => res.json())
      .then(async (result) => {
        if (result.code == 401) {
          await logOut();
          return null;
        }
        let updatedUsers = { ...user, ...result };
        if (updatedUsers) {
          await AsyncStorage.setItem("u", encode(JSON.stringify(updatedUsers)));
        }
        return updatedUsers;
      });

    return response;
  } catch (error) {
    console.error("Update Profile Error:", error);
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("t");
    const encodedUser = await AsyncStorage.getItem("u");

    if (!token || !encodedUser) return null;

    let user = JSON.parse(decode(encodedUser) || "{}");

    return { user: user, token: token };
  } catch (e) {
    console.error("Auth check failed", e);
    return null;
  }
};

// export const logOut = async () => {
//   try {
//     await AsyncStorage.multiRemove(["t", "u", "r"]);
//     router.replace("/(auth)/login");
//   } catch (e) {
//     console.error("Logout Error:", e);
//   }
// };

export const logOut = async () => {
  try {
    const token = await AsyncStorage.getItem("t");

    if (token) {
      const data = await apiRequest(`/auth/logout`, {
        method: "POST",
        auth: true,
        body: { session: token },
      });

      await AsyncStorage.multiRemove(["t", "u", "r"]);
      await AsyncStorage.setItem("loggedOut", "true");
      store.dispatch(setUser(null));
      // router.replace("/(auth)/login");
      // router.dismissAll();
    }
  } catch (e) {
    console.error("Logout Error:===", e);
  }
};
