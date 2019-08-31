import isEmpty from './util/isEmpty';
import isCharKatakana from './util/isCharKatakana';

/**
 * Test if `input` is [Katakana](https://en.wikipedia.org/wiki/Katakana)
 * @param  {String} [input=''] text
 * @return {Boolean} true if all [Katakana](https://en.wikipedia.org/wiki/Katakana)
 */
export default function isKatakana(input: string = ''): boolean {
    if (isEmpty(input)) return false;
    return [...input].every(isCharKatakana);
}