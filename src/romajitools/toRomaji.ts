import katakanaToHiragana from './util/katakanaToHiragana';
import isKatakana from './isKatakana';
import { getKanaToRomajiTree } from './util/kanaToRomajiMap';
import { applyMapping } from './util/kanaMapping';

/**
 * Convert kana to romaji
 * @param  {String} kana text input
 * @param  {DefaultOptions} [options=defaultOptions]
 * @return {String} converted text
 * @example
 * toRomaji('ひらがな　カタカナ')
 * // => 'hiragana katakana'
 * toRomaji('げーむ　ゲーム')
 * // => 'ge-mu geemu'
 * toRomaji('ひらがな　カタカナ', { upcaseKatakana: true })
 * // => 'hiragana KATAKANA'
 * toRomaji('つじぎり', { customRomajiMapping: { じ: 'zi', つ: 'tu', り: 'li' } });
 * // => 'tuzigili'
 */
export default function toRomaji(input = '', upcaseKatakana = false): string {
    // just throw away the substring index information and just concatenate all the kana
    return splitIntoRomaji(input).map(romajiToken => {
        const [start, end, romaji] = romajiToken;
        const makeUpperCase = upcaseKatakana && isKatakana(input.slice(start, end));
        return makeUpperCase ? romaji.toUpperCase() : romaji;
    }).join('');
}

function splitIntoRomaji(input) {
    let map = getKanaToRomajiTree();
    return applyMapping(katakanaToHiragana(input, toRomaji, true), map);
}