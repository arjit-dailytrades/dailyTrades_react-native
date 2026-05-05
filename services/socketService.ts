import { Buffer } from "buffer";

let dlnvWS: WebSocket | null = null;

let ltpData: Record<string, any> = {};

export const initWebsocket = (user: any) => {
  if (!user?.ws) return;

  const WSurl = `${process.env.EXPO_PUBLIC_LTP_WS}/${user.ws}`;

  if (dlnvWS) return;

  dlnvWS = new WebSocket(WSurl);

  dlnvWS.onopen = () => {
    // console.log("WebSocket Connected");
  };

  dlnvWS.onmessage = (evt) => {
    try {
      let tokenLtpData: any = evt.data;

      tokenLtpData = tryToParseJson(tokenLtpData);

      if (!tokenLtpData) return;

      if (tokenLtpData.token) {
        if (tokenLtpData.d) {
          const decoded = Buffer.from(tokenLtpData.d, "base64").toString(
            "utf8",
          );

          tokenLtpData.d = tryToParseJson(decoded);
        }

        if (tokenLtpData?.d?.instrument_token) {
          ltpData[tokenLtpData.d.instrument_token] = tokenLtpData;
        }
      }
    } catch (err) {
      console.log("WS parse error", err);
    }
  };

  dlnvWS.onerror = (error) => {
    console.log("WebSocket Error", error);
  };

  dlnvWS.onclose = () => {
    // console.log("WebSocket Closed");

    dlnvWS = null;

    // reconnect after 5 seconds
    setTimeout(() => {
      initWebsocket(user);
    }, 5000);
  };
};

export const tryToParseJson = (str: any) => {
  try {
    if (typeof str === "string") {
      return JSON.parse(str);
    }
    return str;
  } catch {
    return null;
  }
};

// access ltp anywhere
export const getLtpData = () => ltpData;

export const getSocket = () => dlnvWS;
