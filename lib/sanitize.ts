/**
 * HTML Sanitization utility to prevent XSS attacks
 * Uses DOMPurify for robust sanitization
 */

// Simple HTML sanitization for environments where DOMPurify isn't available
// For production, install and use: npm install dompurify @types/dompurify
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") {
    // Server-side: basic sanitization
    return basicSanitize(dirty);
  }

  // Client-side: use DOMPurify if available, otherwise fallback
  if (typeof (window as any).DOMPurify !== "undefined") {
    return (window as any).DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "u",
        "b",
        "i",
        "a",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "div",
        "span",
        "img",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "blockquote",
        "pre",
        "code",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style", "target"],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ["target"],
      FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input"],
      FORBID_ATTR: [
        "onerror",
        "onload",
        "onclick",
        "onmouseover",
        "onfocus",
        "onblur",
      ],
    });
  }

  // Fallback to basic sanitization
  return basicSanitize(dirty);
}

/**
 * Basic HTML sanitization - removes script tags and event handlers
 * This is a fallback; for production use DOMPurify
 */
function basicSanitize(html: string): string {
  if (!html) return "";

  return (
    html
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove event handlers
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")
      // Remove javascript: URLs
      .replace(/javascript\s*:/gi, "")
      // Remove data: URLs (can be used for XSS)
      .replace(/data\s*:/gi, "")
      // Remove iframe, object, embed tags
      .replace(/<(iframe|object|embed|form|input)\b[^>]*>/gi, "")
      .replace(/<\/(iframe|object|embed|form|input)>/gi, "")
      // Remove style tags (can contain JavaScript)
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
  );
}

/**
 * Escape HTML entities for displaying user input as text
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}
