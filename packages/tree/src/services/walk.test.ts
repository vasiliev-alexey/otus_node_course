import mockfs from "mock-fs";

import walk from "./walk";

describe("test node tree structure", () => {
  afterEach(() => {
    mockfs.restore();
  });

  it("walk is a function", () => {
    expect(walk).toBeInstanceOf(Function);
  });

  it("qqtion", async () => {
    mockfs({
      "/path/fake/": {
        "some-file.txt": "file content here",
        "empty-dir": {},
      },
      "some/": {},
    });

    const data = await walk("/path", 3);
    mockfs.restore();
    // console.log("level", JSON.stringify(data, null, 2));
    expect(data.items).toHaveLength(1);
  });
});
