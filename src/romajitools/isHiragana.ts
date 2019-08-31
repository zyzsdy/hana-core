import isEmpty from './util/isEmpty';
import isCharHiragana from './util/isCharHiragana';

/**
 * Test if `input` is [Hiragana](https://en.wikipedia.org/wiki/Hiragana)
 * @param  {String} [input=''] text
 * @return {Boolean} true if all [Hiragana](https://en.wikipedia.org/wiki/Hiragana)
 */
export default function isHiragana(input: string = ''): boolean {
    if (isEmpty(input)) return false;
    return [...input].every(isCharHiragana);
}