import { KATAKANA_START, HIRAGANA_START } from '../constants';

import isCharLongDash from './isCharLongDash';
import isCharSlashDot from './isCharSlashDot';
import isCharHiragana from './isCharHiragana';

/**
 * Convert [Hiragana](https://en.wikipedia.org/wiki/Hiragana) to [Katakana](https://en.wikipedia.org/wiki/Katakana)
 * Passes through any non-hiragana chars
 * @private
 * @param  {String} [input=''] text input
 * @return {String} converted text
 */
export default function hiraganaToKatakana(input: string = ''): string {
    const kata = [];
    input.split('').forEach(char => {
        // Short circuit to avoid incorrect codeshift for 'ー' and '・'
        if (isCharLongDash(char) || isCharSlashDot(char)) {
            kata.push(char);
        } else if (isCharHiragana(char)) {
            // Shift charcode.
            const code = char.charCodeAt(0) + (KATAKANA_START - HIRAGANA_START);
            const kataChar = String.fromCharCode(code);
            kata.push(kataChar);
        } else {
            // Pass non-hiragana chars through
            kata.push(char);
        }
    });
    return kata.join('');
}