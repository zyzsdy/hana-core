import isHiragana from './isHiragana';
import isKatakana from './isKatakana';
import isRomaji from './isRomaji';

/**
 * Test if `input` contains a mix of [Romaji](https://en.wikipedia.org/wiki/Romaji) *and* [Kana](https://en.wikipedia.org/wiki/Kana), defaults to pass through [Kanji](https://en.wikipedia.org/wiki/Kanji)
 * @param  {String} input text
 * @return {Boolean} true if mixed
 */
export default function isMixed(input: string = ''): boolean {
    const chars = [...input];
    return (chars.some(isHiragana) || chars.some(isKatakana)) && chars.some(isRomaji);
}