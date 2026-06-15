import { useEffect } from "react";
import { useActiveBranding } from "./useActiveBranding";

/**
 * Sets the page favicon dynamically based on the active branding's
 * `logo_pdf_url` field. Falls back to the static favicon in index.html.
 */
export function useDynamicFavicon() {
  const { branding } = useActiveBranding();

  useEffect(() => {
    const href = branding?.logo_pdf_url?.trim();
    if (!href) return;

    const head = document.head;
    // Remove existing icon links
    head.querySelectorAll<HTMLLinkElement>(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    ).forEach((el) => el.parentNode?.removeChild(el));

    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = href;
    head.appendChild(icon);

    const apple = document.createElement("link");
    apple.rel = "apple-touch-icon";
    apple.href = href;
    head.appendChild(apple);
  }, [branding?.logo_pdf_url]);
}
