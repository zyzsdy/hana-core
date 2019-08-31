import typeOf from './typeOf';
/**
 * Checks if input string is empty
 * @param  {String} input text input
 * @return {Boolean} true if no input
 */
export default function isEmpty(input: string): boolean {
    if (typeOf(input) !== 'string') {
        return true;
    }
    return !input.length;
}