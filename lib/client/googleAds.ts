// 구글 광고 전환(태그는 components/Analytics.tsx `ads` — AW-18592628933).
type Gtag = (cmd: "event", name: string, params: Record<string, string | number>) => void;

// 결제 화면(결제 상자)이 처음 보이는 순간의 구글 광고 전환(owner 2026-11-25 — 한국어 사이트와 같은 전환을 영문 사이트에도).
// 결과 쪽은 모두 한꺼번에 그려져 있어 ResultView가 결제 상자가 있는 쪽으로 넘어온 순간에 직접 부른다.
// 결과 하나에 한 번만(sessionStorage). gtag가 없으면 아무것도 안 함. 고민 글·닉네임·이메일은 보내지 않는다.
export const ADS_PAYWALL_SEND_TO = "AW-18592628933/RUJeCInuh78dEMWB1KFF";
export function adsPaywallView(resultId: string) {
  if (typeof window === "undefined" || !resultId) return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  const k = `ssol_ads_paywall_${resultId}`;
  try {
    if (window.sessionStorage.getItem(k)) return;
    window.sessionStorage.setItem(k, "1");
  } catch {}
  try {
    gtag("event", "conversion", { send_to: ADS_PAYWALL_SEND_TO });
  } catch {}
}
