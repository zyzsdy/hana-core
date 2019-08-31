/**
 * Returns detailed type as string (instead of just 'object' for arrays etc)
 * @private
 * @param {any} value js value
 * @returns {String} type of value
 */
export default function typeOf(value: any): string {
    if (value === null) {
        return 'null';
    }
    if (value !== Object(value)) {
        return typeof value;
    }
    return {}.toString.call(value).slice(8, -1).toLowerCase();
}