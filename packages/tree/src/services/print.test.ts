import { printer } from "./printer";

describe("test for printer", () => {
  test("printer is a Function", () => {
    expect(printer).toBeInstanceOf(Function);
  });

  const data: string[] = [];

  const info = jest.spyOn(console, "info").mockImplementation((arg) => {
    data.push(arg);
  });

  test("Test for print data structure", () => {
    printer({
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

    expect(info.mock.calls[0][0]).toEqual("📁  dummy");
    expect(info.mock.calls[1][0]).toEqual("│ 📁  dummy1");
    expect(info.mock.calls[2][0]).toEqual("│ │ └  dummy2");
    expect(info.mock.calls[3][0]).toEqual("\n📁 2 directories, 💾 1 files ");
  });
});
