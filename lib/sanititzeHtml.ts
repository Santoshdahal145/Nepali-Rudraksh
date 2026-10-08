import DomPurify from "dompurify";
import he from "he";

export const decodeHtmlWithHe = (rawHtml: string) => {
  if (!rawHtml) return "";
  const decodeContent = he.decode(rawHtml);
  return decodeContent;
};

export const prepareSafeHtml = (rawHtml: string) => {
  if (!rawHtml) return "";
  const decodedHtml = decodeHtmlWithHe(rawHtml);
  if (
    typeof window !== "undefined" &&
    typeof DomPurify?.sanitize === "function"
  ) {
    return DomPurify.sanitize(decodedHtml);
  }
  return decodedHtml;
};
