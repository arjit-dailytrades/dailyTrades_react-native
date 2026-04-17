import { getSocket } from "./socketService";

export function requestLTP(
  symbolsToSubscribe: string[],
  retries = 6,
  baseDelay = 300,
) {
  const ws = getSocket();

  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ add: symbolsToSubscribe }));
    return;
  }

  if (retries <= 0) {
    console.warn("WebSocket not ready after retries");
    return;
  }

  const delay = baseDelay * Math.pow(2, 6 - retries);

  setTimeout(() => {
    requestLTP(symbolsToSubscribe, retries - 1, baseDelay);
  }, delay);
}
