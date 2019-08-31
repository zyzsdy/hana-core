import isCharInRange from './isCharInRange';
import { JAPANESE_RANGES } from '../constants';

/**
 * Tests a character. Returns true if the character is [Katakana](https://en.wikipedia.org/wiki/Katakana).
 * @param  {String} char character string to test
 * @return {Boolean}
 */
export default function isCharJapanese(char: string = ''): boolean {
    return JAPANESE_RANGES.some(([start, end]) => isCharInRange(char, start, end));
}