import treeProgramm from "./tree";
import walk from "./walk";
jest.mock("./walk");
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

describe("test for  tree commander utility", () => {
  const walkMock = walk as jest.MockedFunction<typeof walk>;
  beforeEach(() => {
    walkMock.mockResolvedValue({
      name: "dummy",
      level: 3,
      items: [
        {
          name: "dummy1",
          level: 2,
          items: [
            {
              name: "dummy2",
              level: 1,
            },
          ],
        },
      ],
    });
  });

  test("utility have a description and name from configuration", () => {
    treeProgramm.usage("custom");
    const helpInformation = treeProgramm.helpInformation();
    const programName = treeProgramm.name();
    expect(helpInformation).toMatch(/^Usage: otus-node-tree custom/);
    expect(programName).toMatch(/^otus-node-tree$/);
  });
  test("success call with option deepth", () => {
    process.argv = ["-d", "2", ".."]; // Same setting it to "-x"
    treeProgramm.parse(process.argv);

    expect(treeProgramm.processedArgs).toEqual([".."]);
  });

  test("success call with args root path ", async () => {
    process.argv = ["-d", "2", ".."]; // Same setting it to "-x"
    treeProgramm.parse(process.argv);
    expect(treeProgramm.processedArgs).toEqual([".."]);
  });

  test("success call with params and mock fs", async () => {
    process.argv = ["-d", "2", ".."]; // Same setting it to "-x"
    treeProgramm.parse(process.argv);
    expect(walkMock).nthCalledWith(1, "..", "2");
  });
});
