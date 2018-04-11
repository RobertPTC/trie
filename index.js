export class TrieRootNode {

     _createNewNode(currentNode, letter, level, wordEnd, capitalizedLetters) {
        let newNode = new TrieNode(currentNode, letter, level, wordEnd, capitalizedLetters);
        currentNode.children[letter] = newNode;
        return newNode;
    }

     _isCapitalLetter(letter) {
        return (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90);
    }

     _wordEndRoutine(foundWords, poppedNode) {
        let letters = [],
            capitalizedLetters = poppedNode.capitalizedLetters,
            capitalizedLettersLength = capitalizedLetters.length;

        while(poppedNode.parentNode) {
            letters.unshift(poppedNode.character);
            poppedNode = poppedNode.parentNode;
        }
        if (capitalizedLettersLength) {
            for (let i = 0; i < capitalizedLettersLength; i++) {
                let capitalizedLetter = letters[capitalizedLetters[i]];
                letters[capitalizedLetters[i]] = capitalizedLetter.toUpperCase();
                //letters[capitalizedLetters[i]].toUpperCase();
            }
        }
        foundWords.push(letters.join(''));
    }

     addNode(word) {
        let currentNode = this,
            wordLength = word.length,
            letter,
            lowercaseLetter,
            capitalizedLetters = [],
            child;
        for (let i = 0; i < wordLength; i++) {
            letter = word[i];
            lowercaseLetter = letter.toLowerCase();
            child = currentNode.children[lowercaseLetter];
            if (typeof child === 'undefined') {
                if (this._isCapitalLetter(letter)) {
                    capitalizedLetters.push(i);
                }
                if (i === wordLength - 1) {
                    this._createNewNode(currentNode, lowercaseLetter, i, true, capitalizedLetters);
                } else {
                    currentNode = this._createNewNode(currentNode, lowercaseLetter, i, false);
                }
            } else {
                if (this._isCapitalLetter(letter)) {
                    capitalizedLetters.push(i);
                }
                currentNode = child;
            }
        }
    }

     suggestWords(word) {
        let currentNode = this,
            wordLength = word.length,
            counter = 0,
            foundWords = [],
            children,
            nodeStack = [],
            poppedNode,
            poppedNodeChildren,
            letters,
            capitalizedLetters,
            capitalizedLettersLength;

        while(counter < wordLength) {
            if (currentNode) {
                currentNode = currentNode.children[word[counter]];
            }
            counter++;
        }

        if (currentNode && currentNode.wordEnd) {
            this._wordEndRoutine(foundWords, currentNode);
        }

        if (currentNode && !(currentNode instanceof TrieRootNode)) {
            children = currentNode.children;
            for (let child in children) {
                nodeStack.push(children[child]);
            }
            while (nodeStack.length > 0) {
                poppedNode = nodeStack.pop();
                poppedNodeChildren = Object.keys(poppedNode.children);
                poppedNodeChildren.forEach((child, idx) => {
                    nodeStack.push(poppedNode.children[child]);
                });
                if (poppedNode.wordEnd) {
                    this._wordEndRoutine(foundWords, poppedNode);
                }
            }
        }
        return foundWords;
    }

    constructor() {
        this.root = true;
        this.children = {};
        this.parentNode = null;
    }
}

class TrieNode {
    constructor(parentNode, character, level, wordEnd, capitalizedLetters) {
        this.parentNode = parentNode;
        this.character = character;
        this.level = level;
        this.wordEnd = wordEnd;
        this.children = {};
        this.capitalizedLetters = capitalizedLetters;
    }
}
