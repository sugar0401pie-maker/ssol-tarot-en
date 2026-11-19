// Safety-screen stop rule for the English site (owner 2026-11-19, same as the Korean site):
// stop the cards only when the writer names a concrete TIME or PLACE for their own death.
// "jump off a bridge" alone and "I picked a date" alone are everyday phrases (owner 2026-11-19) — they need a death word.
// Other direct statements ("I want to die", "suicide", "self-harm") become watch — results are shown with one support line.
// The dictionary screen (screenWorryEn.ts) is left as is; this rule sits on top of it.
import { normEn } from "./normEn.ts";

const DIE = "(kill myself|killing myself|end my life|ending my life|end it all|take my (own )?life|taking my (own )?life|commit suicide|unalive myself|(want|plan|planning|going|decided|ready) to die|die by suicide)";
const TIME = "(today|tonight|tomorrow|this weekend|next week|this week|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|on my birthday|at [0-9]{1,2}(:[0-9]{2})? ?(am|pm)?|next month|in a few days|on the [0-9]{1,2}(st|nd|rd|th))";
const PLACE = "(bridge|roof|rooftop|cliff|train tracks|railway|railroad|balcony|window|building|highway|subway|parking garage|motel|hotel)";

const RULES: RegExp[] = [
  new RegExp(`\\b${TIME}\\b.{0,40}\\b${DIE}`),
  new RegExp(`\\b${DIE}\\b.{0,30}\\b${TIME}\\b`),
  /\bwhen (to|i'?ll|i should|i will) (die|kill myself|end it|end my life)\b/,
  /\b(picked|set|chose|chosen|decided on) (a|the) (date|day)\b.{0,30}\b(die|kill myself|end it|end my life|suicide)\b/,
  /\bwhere (to|i'?ll|i should|i will|i could|i can) (die|kill myself|end it|end my life)\b/,
  /\b(a|the) (place|spot) to (die|kill myself|end it|end my life)\b/,
  new RegExp(`\\b${PLACE}\\b.{0,30}\\b${DIE}`),
  new RegExp(`\\b${DIE}\\b.{0,30}\\b${PLACE}\\b`),
];
// someone else's death, reported threats, figures of speech
const STRIP: RegExp[] = [
  /\b(my|our) (mom|mother|dad|father|parents?|grandma|grandmother|grandpa|grandfather|dog|cat|pet|husband|wife|son|daughter|kid|child|friend|boyfriend|girlfriend|partner|ex)\b[^.?!]{0,40}/g,
  /\b(he|she|they)('ll| will| would| said| says| threatened)[^.?!]{0,40}/g,
  /\b(killing me|dying to|could die|i'?m dying|died laughing|kill me)\b/g,
];

export function hasConcretePlanEn(text: string): boolean {
  const t = STRIP.reduce((s, re) => s.replace(re, " "), normEn(text));
  return RULES.some((re) => re.test(t));
}

export function applyPlanRuleEn<T extends { level: string; matched?: string[] }>(r: T, text: string): T {
  if (hasConcretePlanEn(text)) return { ...r, level: "urgent", matched: [...(r.matched ?? []), "plan:time_or_place"] };
  if (r.level === "urgent") return { ...r, level: "watch" };
  return r;
}
