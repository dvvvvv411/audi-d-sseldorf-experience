import { useEffect, RefObject } from "react";
import { useActiveBranding, getBrandShort } from "./useActiveBranding";

/**
 * Walks all text nodes inside `ref` and replaces hardcoded brand references
 * with values from the active branding. Runs once when branding becomes available.
 */
export function useDynamicLegalReplacements(ref: RefObject<HTMLElement>) {
  const { branding } = useActiveBranding();

  useEffect(() => {
    if (!branding || !ref.current) return;
    const footerCompany = (branding as any).footer_unternehmensname || branding.name || "";
    const brandShort = getBrandShort(branding) || "";
    const contactEmail = branding.email || "";
    const ownDomain = (branding as any).eigene_domain || "";

    const root = ref.current;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) nodes.push(n as Text);

    for (const node of nodes) {
      let v = node.nodeValue || "";
      const original = v;
      if (footerCompany) {
        v = v.replace(/AUDI AG/g, footerCompany);
        v = v.replace(/Audi AG/g, footerCompany);
      }
      // Replace common Audi e-mails with branding contact email
      if (contactEmail) {
        v = v.replace(/[a-zA-Z0-9._-]+@audi\.de/g, contactEmail);
      }
      // Replace audi.de URLs with own domain (or strip)
      if (ownDomain) {
        v = v.replace(/www\.audi\.de/g, `www.${ownDomain}`);
        v = v.replace(/(?<!@)audi\.de/g, ownDomain);
      }
      if (brandShort) {
        // Replace standalone "Audi" word, case-sensitive, but avoid sub-words
        v = v.replace(/\bAudi\b/g, brandShort);
      }
      if (v !== original) node.nodeValue = v;
    }
  }, [branding, ref]);

  return { branding };
}
