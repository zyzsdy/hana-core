import hiraganaToKatakana from './util/hiraganaToKatakana';
import isCharEnglishPunctuation from './util/isCharEnglishPunctuation';
import toKana from './toKana';
import isRomaji from './isRomaji';
import isMixed from './isMixed';

/**
 * Convert input to [Katakana](https://en.wikipedia.org/wiki/Katakana)
 * @param  {String} [input=''] text
 * @return {String} converted text
 */
export default function toKatakana(input: string = ''): string {
    if (isMixed(input) || isRomaji(input) || isCharEnglishPunctuation(input)) {
        const hiragana = toKana(input.toLowerCase());
        return hiraganaToKatakana(hiragana);
    }

    return hiraganaToKatakana(input);
}