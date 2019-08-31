import { getRomajiToKanaTree } from './util/romajiToKanaMap';
import { applyMapping } from './util/kanaMapping';
import isCharUpperCase from './util/isCharUpperCase';
import hiraganaToKatakana from './util/hiraganaToKatakana';

/**
 * Convert [Romaji](https://en.wikipedia.org/wiki/Romaji) to [Kana](https://en.wikipedia.org/wiki/Kana), lowercase text will result in [Hiragana](https://en.wikipedia.org/wiki/Hiragana) and uppercase text will result in [Katakana](https://en.wikipedia.org/wiki/Katakana).
 * @param  {String} [input=''] text
 * @param  {DefaultOptions} [options=defaultOptions]
 * @return {String} converted text
 */
export default function toKana(input: string = ''): string {
    let map = getRomajiToKanaTree();

    // throw away the substring index information and just concatenate all the kana
    return splitIntoConvertedKana(input, map).map(kanaToken => {
        const [start, end, kana] = kanaToken;
        if (kana === null) {
            // haven't converted the end of the string, since we are in IME mode
            return input.slice(start);
        }
        return kana;
    }).join('');
}

/**
 *
 * @private
 * @param {String} [input=''] input text
 * @param {Object} [options={}] toKana options
 * @returns {Array[]} [[start, end, token]]
 * @example
 * splitIntoConvertedKana('buttsuuji')
 * // => [[0, 2, 'ぶ'], [2, 6, 'っつ'], [6, 7, 'う'], [7, 9, 'じ']]
 */
export function splitIntoConvertedKana(input = '', map) {
    return applyMapping(input.toLowerCase(), map);
}