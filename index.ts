interface Node<T> {
  children: { [key: string]: Node<T> };
  parentNode: null | Node<T>;
  capitalizedLetters?: number[];
  letter: string;
  wordEnd: boolean;
  data: undefined | T;
}

export type Trie<T> = {
  addWord(word: string, node: T): void;
  findWords(s: string): {
    value: string;
    data: T;
  }[];
};

export default function TrieFactory<T>(): Trie<T> {
  const rootNode: Node<T> = {
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

  function _createNewNode<T>(
    parentNode: Node<T>,
    letter: string,
    wordEnd: boolean,
    data?: T,
    capitalizedLetters?: number[]
  ) {
    const n: Node<T> = {
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

  function _addWord(word: string, node: T) {
    let c: Node<T> = rootNode;
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

  function _memoizedFindWords(
    searchResults: {
      value: string;
      data: T;
    }[]
  ) {
    return function findWords(s: string, c: { [key: string]: Node<T> }) {
      const n = c[s];
      if (!n || !Object.keys(n.children)) return searchResults;
      if (n.wordEnd) {
        const letters: string[] = [];
        let p: Node<T> = n;
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
          searchResults = [
            ...searchResults,
            { data: n.data, value: capitalizedResult.join("") },
          ];
        }
      }
      for (let child in n.children) {
        findWords(child, n.children);
      }
      return searchResults;
    };
  }

  return {
    addWord: _addWord,
    findWords: (s: string) => {
      let children = rootNode.children;
      const normalized = s.toLowerCase();
      normalized.split("").forEach((l, i) => {
        if (children[l] && i !== s.length - 1) {
          children = children[l].children;
        }
      });
      return _memoizedFindWords([])(
        normalized[normalized.length - 1],
        children
      );
    },
  };
}
