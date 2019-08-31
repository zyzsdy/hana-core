import typeOf from './util/typeOf'
import isEmpty from './util/isEmpty';
import isCharJapanese from './util/isCharJapanese';

/**
 * Test if `input` only includes [Kanji](https://en.wikipedia.org/wiki/Kanji), [Kana](https://en.wikipedia.org/wiki/Kana), zenkaku numbers, and JA punctuation/symbols.”
 * @param  {String} [input=''] text
 * @return {Boolean} true if passes checks
 */
export default function isJapanese(input: string = ''): boolean {
    return isEmpty(input) ? false : [...input].every(char => {
        return isCharJapanese(char);
    });
}