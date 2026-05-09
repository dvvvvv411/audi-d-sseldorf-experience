import { useEffect } from "react";

/**
 * Injects a Meta Pixel snippet (containing <script> and/or <noscript> tags)
 * into the document head. Cleans up on unmount or when code/aktiv changes.
 */
export function useMetaPixel(code: string | null | undefined, aktiv: boolean | undefined) {
  useEffect(() => {
    if (!aktiv || !code || !code.trim()) return;

    const appended: Node[] = [];

    try {
      const doc = new DOMParser().parseFromString(`<div>${code}</div>`, "text/html");
      const wrapper = doc.body.firstElementChild;
      if (!wrapper) return;

      Array.from(wrapper.childNodes).forEach((node) => {
        if (node.nodeType !== 1) return;
        const el = node as Element;
        const tag = el.tagName.toLowerCase();

        if (tag === "script") {
          const s = document.createElement("script");
          Array.from(el.attributes).forEach((a) => s.setAttribute(a.name, a.value));
          s.text = el.textContent ?? "";
          document.head.appendChild(s);
          appended.push(s);
        } else if (tag === "noscript") {
          const ns = document.createElement("noscript");
          ns.innerHTML = el.innerHTML;
          document.head.appendChild(ns);
          appended.push(ns);
        }
      });
    } catch (err) {
      console.error("Meta Pixel injection failed:", err);
    }

    return () => {
      appended.forEach((n) => {
        if (n.parentNode) n.parentNode.removeChild(n);
      });
    };
  }, [code, aktiv]);
}
