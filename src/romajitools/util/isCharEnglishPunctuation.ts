import isEmpty from './isEmpty';
import { EN_PUNCTUATION_RANGES } from '../constants';
import isCharInRange from './isCharInRange';

/**
 * Tests a character. Returns true if the character is considered English punctuation.
 * @param  {String} char character string to test
 * @return {Boolean}
 */
export default function isCharEnglishPunctuation(char: string = ''): boolean {
    if (isEmpty(char)) return false;
    return EN_PUNCTUATION_RANGES.some(([start, end]) => isCharInRange(char, start, end));
}