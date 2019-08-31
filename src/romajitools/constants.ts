export const LATIN_UPPERCASE_START = 0x41;
export const LATIN_UPPERCASE_END = 0x5a;
export const LOWERCASE_ZENKAKU_START = 0xff41;
export const LOWERCASE_ZENKAKU_END = 0xff5a;
export const UPPERCASE_ZENKAKU_START = 0xff21;
export const UPPERCASE_ZENKAKU_END = 0xff3a;

export const HIRAGANA_START = 0x3041;
export const HIRAGANA_END = 0x3096;
export const KATAKANA_START = 0x30a1;
export const KATAKANA_END = 0x30fc;
export const PROLONGED_SOUND_MARK = 0x30fc;
export const KANA_SLASH_DOT = 0x30fb;

const ZENKAKU_NUMBERS = [0xff10, 0xff19];
const ZENKAKU_UPPERCASE = [UPPERCASE_ZENKAKU_START, UPPERCASE_ZENKAKU_END];
const ZENKAKU_LOWERCASE = [LOWERCASE_ZENKAKU_START, LOWERCASE_ZENKAKU_END];
const ZENKAKU_PUNCTUATION_1 = [0xff01, 0xff0f];
const ZENKAKU_PUNCTUATION_2 = [0xff1a, 0xff1f];
const ZENKAKU_PUNCTUATION_3 = [0xff3b, 0xff3f];
const ZENKAKU_PUNCTUATION_4 = [0xff5b, 0xff60];
const ZENKAKU_SYMBOLS_CURRENCY = [0xffe0, 0xffee];

const HIRAGANA_CHARS = [0x3040, 0x309f];
const KATAKANA_CHARS = [0x30a0, 0x30ff];
const HANKAKU_KATAKANA = [0xff66, 0xff9f];
const KATAKANA_PUNCTUATION = [0x30fb, 0x30fc];
const KANA_PUNCTUATION = [0xff61, 0xff65];
const CJK_SYMBOLS_PUNCTUATION = [0x3000, 0x303f];
const COMMON_CJK = [0x4e00, 0x9fff];
const RARE_CJK = [0x3400, 0x4dbf];

export const KANA_RANGES = [HIRAGANA_CHARS, KATAKANA_CHARS, KANA_PUNCTUATION, HANKAKU_KATAKANA];

export const JA_PUNCTUATION_RANGES = [CJK_SYMBOLS_PUNCTUATION, KANA_PUNCTUATION, KATAKANA_PUNCTUATION, ZENKAKU_PUNCTUATION_1, ZENKAKU_PUNCTUATION_2, ZENKAKU_PUNCTUATION_3, ZENKAKU_PUNCTUATION_4, ZENKAKU_SYMBOLS_CURRENCY];

export const JAPANESE_RANGES = [...KANA_RANGES, ...JA_PUNCTUATION_RANGES, ZENKAKU_UPPERCASE, ZENKAKU_LOWERCASE, ZENKAKU_NUMBERS, COMMON_CJK, RARE_CJK];

const MODERN_ENGLISH = [0x0000, 0x007f];
const HEPBURN_MACRON_RANGES = [[0x0100, 0x0101], // Ā ā
[0x0112, 0x0113], // Ē ē
[0x012a, 0x012b], // Ī ī
[0x014c, 0x014d], // Ō ō
[0x016a, 0x016b]];
const SMART_QUOTE_RANGES = [[0x2018, 0x2019], // ‘ ’
[0x201c, 0x201d]];

export const ROMAJI_RANGES = [MODERN_ENGLISH, ...HEPBURN_MACRON_RANGES];

export const EN_PUNCTUATION_RANGES = [[0x20, 0x2f], [0x3a, 0x3f], [0x5b, 0x60], [0x7b, 0x7e], ...SMART_QUOTE_RANGES];