// English text normalizer shared by the safety screens.
export function normEn(text: string): string {
  return String(text || "")
    .toLowerCase()
    .replace(/[‘’‛′]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/\bwanna\b/g, "want to")
    .replace(/\bgonna\b/g, "going to")
    .replace(/\s+/g, " ")
    .trim();
}
