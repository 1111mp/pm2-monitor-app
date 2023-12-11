/**
 * https://github.com/taufik-nurrohman/highlight.ln.js
 */

import type { HLJSPlugin } from "highlight.js";

function getColorParts(el: HTMLElement) {
  let color = window.getComputedStyle(el).color || "",
    c;
  // <https://www.regular-expressions.info/numericranges.html>
  if (
    (c = color.match(
      /^rgba\s*\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*[, ]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*[, ]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*[, ]\s*([01]|0?\.\d+)\s*\)$/i,
    ))
  ) {
    return [+c[1]!, +c[2]!, +c[3]!, +c[4]!];
  }
  if (
    (c = color.match(
      /^rgb\s*\(\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*[, ]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*[, ]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*\)$/i,
    ))
  ) {
    return [+c[1]!, +c[2]!, +c[3]!, 1];
  }
  return [0, 0, 0, 1];
}

export const LineNumber: HLJSPlugin = {
  "after:highlightBlock": ({ block }) => {
    if (block.classList.contains("language-undefined")) return;

    let blockParent = block.parentElement!,
      blockHasParent =
        blockParent && "pre" === blockParent.nodeName.toLowerCase(),
      lines = document.createElement("code"),
      numbers = [];
    if (blockHasParent) {
      for (let i = 0, j = block.textContent!.split(/\n/).length; i < j; ++i) {
        numbers.push(i + 1);
      }
      blockParent.insertBefore(lines, block);
      blockParent.style.display = "flex";
      lines.innerHTML = numbers.join("\n");
      lines.style.textAlign = "right";
      lines.style.userSelect = "none"; // Disable selection
      lines.className = "hljs bg-transparent dark:bg-transparent p-2 text-sm"; // Inherit `background` and `padding` from the style sheet
      let rgba = getColorParts(lines);
      lines.style.borderRight =
        "2px solid rgba(" +
        rgba[0] +
        "," +
        rgba[1] +
        "," +
        rgba[2] +
        "," +
        rgba[3]! / 10 +
        ")";
      (block as HTMLElement).style.flex = "1";
    }
  },
};
