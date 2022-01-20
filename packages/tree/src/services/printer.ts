import { NodeItem } from "../types";

export const printer = (item: NodeItem, level = 0): void => {
  const nodeImg = item.items ? "📁" : "└";
  console.log(`${"│ ".repeat(level)}${nodeImg}  ${item.name}`);
  if (item.items) {
    const nextLevel = level + 1;
    for (const it of item.items) {
      printer(it, nextLevel);
    }
  }
};
