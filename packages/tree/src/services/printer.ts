import { NodeItem } from "../types";

let dirCount = 0;
let fileCount = 0;

const printerInternal = (item: NodeItem, level: number): void => {
  const nodeImg = item.items ? "📁" : "└";
  // eslint-disable-next-line no-console
  console.info(`${"│ ".repeat(level)}${nodeImg}  ${item.name}`);
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
  // eslint-disable-next-line no-console
  console.info(`\n📁 ${dirCount} directories, 💾 ${fileCount} files `);
};
