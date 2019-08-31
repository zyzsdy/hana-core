import DoubleArray from '../doublearraytrie/doublearray'
import DAT from '../doublearraytrie/dat'
import TokenInfoDictionary from './TokenInfoDictionary'
import ConnectionCosts from './ConnectionCosts'
import UnknownDictionary from './UnknownDictionary'


export default class DynamicDictionaries{
    trie: DoubleArray;
    token_info_dictionary: TokenInfoDictionary;
    connection_costs: ConnectionCosts;
    unknown_dictionary: UnknownDictionary
    /**
     * Dictionaries container for Tokenizer
     * @param {DoubleArray} trie
     * @param {TokenInfoDictionary} token_info_dictionary
     * @param {ConnectionCosts} connection_costs
     * @param {UnknownDictionary} unknown_dictionary
     * @constructor
     */
    constructor(trie: DoubleArray = null, token_info_dictionary: TokenInfoDictionary = null, connection_costs: ConnectionCosts = null, unknown_dictionary: UnknownDictionary = null) {
        if (trie != null) {
            this.trie = trie;
        } else {
            this.trie = DAT.builder(0).build([
                {k: "", v: 1}
            ]);
        }
        if (token_info_dictionary != null) {
            this.token_info_dictionary = token_info_dictionary;
        } else {
            this.token_info_dictionary = new TokenInfoDictionary();
        }
        if (connection_costs != null) {
            this.connection_costs = connection_costs;
        } else {
            // backward_size * backward_size
            this.connection_costs = new ConnectionCosts(0, 0);
        }
        if (unknown_dictionary != null) {
            this.unknown_dictionary = unknown_dictionary;
        } else {
            this.unknown_dictionary = new UnknownDictionary();
        }
    }

    // from base.dat & check.dat
    loadTrie(base_buffer, check_buffer) {
        this.trie = DAT.load(base_buffer, check_buffer);
        return this;
    };

    loadTokenInfoDictionaries(token_info_buffer: Uint8Array, pos_buffer: Uint8Array, target_map_buffer: Uint8Array) {
        this.token_info_dictionary.loadDictionary(token_info_buffer);
        this.token_info_dictionary.loadPosVector(pos_buffer);
        this.token_info_dictionary.loadTargetMap(target_map_buffer);
        return this;
    };

    loadConnectionCosts(cc_buffer: Int16Array) {
        this.connection_costs.loadConnectionCosts(cc_buffer);
        return this;
    };

    loadUnknownDictionaries(unk_buffer: Uint8Array, unk_pos_buffer: Uint8Array, unk_map_buffer: Uint8Array, cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array) {
        this.unknown_dictionary.loadUnknownDictionaries(unk_buffer, unk_pos_buffer, unk_map_buffer, cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
        return this;
    };
}