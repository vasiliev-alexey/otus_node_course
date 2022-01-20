import fs from "fs/promises";
import path from "path";
import { NodeItem } from "../types";
import * as Path from "path";

export default async function walk(directory: string, level: number) {
  //let fileList: string[] = [];

  const rootItem: NodeItem = {
    name: Path.basename(directory),
    level: level,
    items: [],
  };
  const curLevel = level - 1;
  if (curLevel === 0) {
    return rootItem;
  }

  const files = await fs.readdir(directory);

  for (const file of files) {
    const item: NodeItem = {
      name: Path.basename(file),
      level: curLevel,
      items: [],
    };

    const p = path.join(directory, file);
    if ((await fs.stat(p)).isDirectory()) {
      // fileList = [...fileList, ...(await walk(p, curLevel))];

      const dirItem = await walk(p, curLevel);
      rootItem.items.push(dirItem);
    } else {
      // fileList.push(p);
      delete item.items;
      rootItem.items.push(item);
    }
  }

  return rootItem;
}