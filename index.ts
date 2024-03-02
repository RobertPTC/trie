interface Node {
  children: { [key: string]: Node };
  parentNode: null | Node;
  capitalizedLetters?: number[];
  letter: string;
  wordEnd: boolean;
  data: undefined | { [key: string]: any };
}

export default function Trie() {
  let searchResults: { value: string; data: { [key: string]: any } }[] = [];

  const rootNode: Node = {
    capitalizedLetters: [],
    children: {},
    data: undefined,
    letter: "",
    parentNode: null,
    wordEnd: false,
  };

  function _isCapitalLetter(letter: string) {
    return letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90;
  }

  function _createNewNode(
    parentNode: Node,
    letter: string,
    wordEnd: boolean,
    data?: { [key: string]: any },
    capitalizedLetters?: number[]
  ) {
    const n: Node = {
      capitalizedLetters,
      children: {},
      data,
      letter,
      parentNode,
      wordEnd,
    };
    parentNode.children[letter] = n;
    return n;
  }

  function addWord(word: string, node: { [key: string]: any }) {
    let c: Node = rootNode;
    const letters = word.split("");
    const capitalizedLetters: number[] = [];
    letters.forEach((l, i) => {
      const lowerCaseLetter = l.toLowerCase();
      const child = c.children[lowerCaseLetter];
      if (_isCapitalLetter(l)) {
        capitalizedLetters.push(i);
      }
      if (typeof child === "undefined") {
        if (i === letters.length - 1) {
          return _createNewNode(
            c,
            lowerCaseLetter,
            true,
            node,
            capitalizedLetters
          );
        }
        c = _createNewNode(c, lowerCaseLetter, false);
      } else {
        c = child;
      }
    });
  }

  function findWords(s: string, c: { [key: string]: Node }) {
    const n = c[s];
    if (!n || !Object.keys(n.children)) return;
    if (n.wordEnd) {
      const letters: string[] = [];
      let p: Node = n;
      while (p.parentNode) {
        letters.unshift(p.letter);
        p = p.parentNode;
      }
      const capitalizedResult = letters.map((l, i) => {
        if (n.capitalizedLetters && n.capitalizedLetters.includes(i)) {
          return l.toUpperCase();
        }
        return l;
      });
      if (n.data) {
        searchResults.push({ data: n.data, value: capitalizedResult.join("") });
      }
    }
    for (let child in n.children) {
      findWords(child, n.children);
    }
  }

  return {
    addWord,
    findWords: (s: string) => {
      searchResults = [];
      let children = rootNode.children;
      const normalized = s.toLowerCase();
      normalized.split("").forEach((l, i) => {
        if (children[l] && i !== s.length - 1) {
          children = children[l].children;
        }
      });
      findWords(normalized[normalized.length - 1], children);
      return searchResults;
    },
  };
}
