import { KATAKANA_START, KATAKANA_END } from '../constants';

import isCharInRange from './isCharInRange';

/**
 * Tests a character. Returns true if the character is [Katakana](https://en.wikipedia.org/wiki/Katakana).
 * @param  {String} char character string to test
 * @return {Boolean}
 */
export default function isCharKatakana(char: string = ''): boolean {
    return isCharInRange(char, KATAKANA_START, KATAKANA_END);
}