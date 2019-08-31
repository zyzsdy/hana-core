import isEmpty from './isEmpty';
import { PROLONGED_SOUND_MARK } from '../constants';

/**
 * Returns true if char is 'ー'
 * @param  {String} char to test
 * @return {Boolean}
 */
export default function isCharLongDash(char: string = ''): boolean {
    if (isEmpty(char)) return false;
    return char.charCodeAt(0) === PROLONGED_SOUND_MARK;
}