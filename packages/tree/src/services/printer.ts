import { NodeItem } from "../types";

let dirCount = 0;
let fileCount = 0;

const printerInternal = (item: NodeItem, level = 0): void => {
  const nodeImg = item.items ? "📁" : "└";
  console.log(`${"│ ".repeat(level)}${nodeImg}  ${item.name}`);
  if (item.items) {
    dirCount++;
    const nextLevel = level + 1;
    for (const it of item.items) {
      printerInternal(it, nextLevel);
    }
  } else {
    fileCount++;
  }
};
export const printer = (item: NodeItem): void => {
  dirCount = 0;
  fileCount = 0;
  printerInternal(item, 0);
  console.log(`\n📁 ${dirCount} directories, 💾 ${fileCount} files `);
};
