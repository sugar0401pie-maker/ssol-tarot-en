import { xPurchaseEventId } from "@/lib/billing/xConversion";

// X 픽셀 결제 완료 이벤트(owner 2026-11-25, 영문 사이트 — 달러). 서버 전환 API와 같은 conversion_id(주문 번호)라 X가 한 번으로 센다.
// 이벤트 ID나 픽셀이 없으면 아무것도 안 함. 같은 주문은 브라우저에서 한 번만.
type Twq = (cmd: "event", id: string, params: Record<string, string | number>) => void;
export function xPurchase(amount: number, orderId: string, currency: "KRW" | "USD" = "USD") {
  if (typeof window === "undefined" || !orderId || !(amount > 0)) return;
  const eventId = xPurchaseEventId();
  const twq = (window as unknown as { twq?: Twq }).twq;
  if (!eventId || typeof twq !== "function") return;
  const k = `ssol_x_purchase_${orderId}`;
  try {
    if (window.sessionStorage.getItem(k)) return;
    window.sessionStorage.setItem(k, "1");
  } catch {}
  try {
    twq("event", eventId, { value: amount, currency, conversion_id: orderId });
  } catch {}
}
