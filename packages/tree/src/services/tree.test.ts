import walk from "./tree";

describe("test node tree structure", () => {
  it("tree is a function", () => {
    expect(walk).toBeInstanceOf(Function);
  });
});
