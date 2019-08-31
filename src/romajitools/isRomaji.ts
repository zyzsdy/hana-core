import typeOf from './util/typeOf';
import isEmpty from './util/isEmpty';
import isCharRomaji from './util/isCharRomaji';

/**
 * Test if `input` is [Romaji](https://en.wikipedia.org/wiki/Romaji) (allowing [Hepburn romanisation](https://en.wikipedia.org/wiki/Hepburn_romanization))
 * @param  {String} [input=''] text
 * @param  {Regexp} [allowed] additional test allowed to pass for each char
 * @return {Boolean} true if [Romaji](https://en.wikipedia.org/wiki/Romaji)
 */
export default function isRomaji(input: string = '', allowed: any = undefined): boolean {
    const augmented = typeOf(allowed) === 'regexp';
    return isEmpty(input) ? false : [...input].every(char => {
        const isRoma = isCharRomaji(char);
        return !augmented ? isRoma : isRoma || allowed.test(char);
    });
}