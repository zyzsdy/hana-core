

export default class SurrogateAwareString{
    str: string;
    index_mapping: number[];
    length: number;
    /**
     * String wrapper for UTF-16 surrogate pair (4 bytes)
     * @param {string} str String to wrap
     * @constructor
     */
    constructor(str: string) {
        this.str = str;
        this.index_mapping = [];

        for (var pos = 0; pos < str.length; pos++) {
            var ch = str.charAt(pos);
            this.index_mapping.push(pos);
            if (SurrogateAwareString.isSurrogatePair(ch)) {
                pos++;
            }
        }
        // Surrogate aware length
        this.length = this.index_mapping.length;
    }

    slice(index: number) {
        if (this.index_mapping.length <= index) {
            return "";
        }
        var surrogate_aware_index = this.index_mapping[index];
        return this.str.slice(surrogate_aware_index);
    };

    charAt(index: number) {
        if (this.str.length <= index) {
            return "";
        }
        var surrogate_aware_start_index = this.index_mapping[index];
        var surrogate_aware_end_index = this.index_mapping[index + 1];

        if (surrogate_aware_end_index == null) {
            return this.str.slice(surrogate_aware_start_index);
        }
        return this.str.slice(surrogate_aware_start_index, surrogate_aware_end_index);
    };

    charCodeAt(index: number) {
        if (this.index_mapping.length <= index) {
            return NaN;
        }
        var surrogate_aware_index = this.index_mapping[index];
        var upper = this.str.charCodeAt(surrogate_aware_index);
        var lower: number;
        if (upper >= 0xD800 && upper <= 0xDBFF && surrogate_aware_index < this.str.length) {
            lower = this.str.charCodeAt(surrogate_aware_index + 1);
            if (lower >= 0xDC00 && lower <= 0xDFFF) {
                return (upper - 0xD800) * 0x400 + lower - 0xDC00 + 0x10000;
            }
        }
        return upper;
    };

    toString() {
        return this.str;
    };

    static isSurrogatePair(ch: string) {
        var utf16_code = ch.charCodeAt(0);
        if (utf16_code >= 0xD800 && utf16_code <= 0xDBFF) {
            // surrogate pair
            return true;
        } else {
            return false;
        }
    };
}