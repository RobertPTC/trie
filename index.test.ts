import Trie from "./index";
describe("trie", () => {
  it("finds words", () => {
    const t = Trie<{ name: string }>();
    t.addWord("apple", { name: "apple" });
    t.addWord("ash", { name: "ash" });
    t.addWord("Ashley", { name: "Ashley" });
    t.addWord("bear", { name: "bear" });
    t.addWord("abracadbra", { name: "abracadabra" });
    t.addWord("Rio de Janeiro", { name: "Rio de Janeiro" });
    expect(t.findWords("R")).toStrictEqual([
      { value: "Rio de Janeiro", data: { name: "Rio de Janeiro" } },
    ]);
    expect(t.findWords("ash")).toStrictEqual([
      { value: "ash", data: { name: "ash" } },
      { value: "Ashley", data: { name: "Ashley" } },
    ]);
  });
});
