import ByteBuffer from '../util/ByteBuffer'

export type TargetMap = Map<number, number[]>;
export type DictionaryEntries = Map<number, string>;

export default class TokenInfoDictionary{
    dictionary: ByteBuffer;
    pos_buffer: ByteBuffer;
    target_map: TargetMap;
    /**
     * TokenInfoDictionary
     * @constructor
     */
    constructor() {
        this.dictionary = new ByteBuffer(10 * 1024 * 1024);
        this.target_map = new Map<number, number[]>();  // trie_id (of surface form) -> token_info_id (of token)
        this.pos_buffer = new ByteBuffer(10 * 1024 * 1024);
    }

    // left_id right_id word_cost ...
    // ^ this position is token_info_id
    buildDictionary(entries: string[][]) {
        var dictionary_entries: DictionaryEntries = new Map<number, string>();  // using as hashmap, string -> string (word_id -> surface_form) to build dictionary

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];

            if (entry.length < 4) {
                continue;
            }

            var surface_form = entry[0];
            var left_id = parseInt(entry[1]);
            var right_id = parseInt(entry[2]);
            var word_cost = parseInt(entry[3]);
            var feature = entry.slice(4).join(",");  // TODO Optimize

            // Assertion
            if (!isFinite(left_id) || !isFinite(right_id) || !isFinite(word_cost)) {
                console.log(entry);
            }

            var token_info_id = this.put(left_id, right_id, word_cost, surface_form, feature);
            dictionary_entries[token_info_id] = surface_form;
        }

        // Remove last unused area
        this.dictionary.shrink();
        this.pos_buffer.shrink();

        return dictionary_entries;
    };

    put(left_id: number, right_id: number, word_cost: number, surface_form: string, feature: string) {
        var token_info_id = this.dictionary.position;
        var pos_id = this.pos_buffer.position;

        this.dictionary.putShort(left_id);
        this.dictionary.putShort(right_id);
        this.dictionary.putShort(word_cost);
        this.dictionary.putInt(pos_id);
        this.pos_buffer.putString(surface_form + "," + feature);

        return token_info_id;
    };

    addMapping(source: number, target: number) {
        var mapping: number[] = this.target_map[source];
        if (mapping == null) {
            mapping = [];
        }
        mapping.push(target);

        this.target_map[source] = mapping;
    };

    targetMapToBuffer() {
        var buffer = new ByteBuffer();
        var map_keys_size = Object.keys(this.target_map).length;
        buffer.putInt(map_keys_size);
        for (var key in this.target_map) {
            var values = this.target_map[key];  // Array
            var map_values_size = values.length;
            buffer.putInt(parseInt(key));
            buffer.putInt(map_values_size);
            for (var i = 0; i < values.length; i++) {
                buffer.putInt(values[i]);
            }
        }
        return buffer.shrink();  // Shrink-ed Typed Array
    };

    // from tid.dat
    loadDictionary(array_buffer: Uint8Array) {
        this.dictionary = new ByteBuffer(array_buffer);
        return this;
    };

    // from tid_pos.dat
    loadPosVector(array_buffer: Uint8Array) {
        this.pos_buffer = new ByteBuffer(array_buffer);
        return this;
    };

    // from tid_map.dat
    loadTargetMap(array_buffer: Uint8Array) {
        var buffer = new ByteBuffer(array_buffer);
        buffer.position = 0;
        this.target_map = new Map<number, number[]>();
        buffer.readInt();  // map_keys_size
        while (true) {
            if (buffer.buffer.length < buffer.position + 1) {
                break;
            }
            var key = buffer.readInt();
            var map_values_size = buffer.readInt();
            for (var i = 0; i < map_values_size; i++) {
                var value = buffer.readInt();
                this.addMapping(key, value);
            }
        }
        return this;
    };

    /**
     * Look up features in the dictionary
     * @param {number} token_info_id Word ID to look up
     * @returns {string} Features string concatenated by ","
     */
    getFeatures(token_info_id: number): string {
        if (isNaN(token_info_id)) {
            // TODO throw error
            return "";
        }
        var pos_id = this.dictionary.getInt(token_info_id + 6);
        return this.pos_buffer.getString(pos_id);
    };
}