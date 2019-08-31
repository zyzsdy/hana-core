import ViterbiNode from './ViterbiNode'
import ViterbiLattice from './ViterbiLattice'
import SurrogateAwareString from '../util/SurrogateAwareString'
import DynamicDictionaries from '../dict/DynamicDictionaries';
import DoubleArray from '../doublearraytrie/doublearray';
import TokenInfoDictionary from '../dict/TokenInfoDictionary';
import UnknownDictionary from '../dict/UnknownDictionary';
import CharacterClass from '../dict/CharacterClass';

export default class ViterbiBuilder{
    trie: DoubleArray;
    token_info_dictionary: TokenInfoDictionary;
    unknown_dictionary: UnknownDictionary;
    /**
     * ViterbiBuilder builds word lattice (ViterbiLattice)
     * @param {DynamicDictionaries} dic dictionary
     * @constructor
     */
    constructor(dic: DynamicDictionaries) {
        this.trie = dic.trie;
        this.token_info_dictionary = dic.token_info_dictionary;
        this.unknown_dictionary = dic.unknown_dictionary;
    }

    /**
     * Build word lattice
     * @param {string} sentence_str Input text
     * @returns {ViterbiLattice} Word lattice
     */
    build(sentence_str: string): ViterbiLattice {
        var lattice = new ViterbiLattice();
        var sentence = new SurrogateAwareString(sentence_str);

        var key: string, trie_id: number, left_id: number, right_id: number, word_cost: number;
        for (var pos = 0; pos < sentence.length; pos++) {
            var tail = sentence.slice(pos);
            var vocabulary = this.trie.commonPrefixSearch(tail);
            for (var n = 0; n < vocabulary.length; n++) {  // Words in dictionary do not have surrogate pair (only UCS2 set)
                trie_id = vocabulary[n].v;
                key = vocabulary[n].k;

                var token_info_ids: number[] = this.token_info_dictionary.target_map[trie_id];
                for (var i = 0; i < token_info_ids.length; i++) {
                    var token_info_id = token_info_ids[i];

                    left_id = this.token_info_dictionary.dictionary.getShort(token_info_id);
                    right_id = this.token_info_dictionary.dictionary.getShort(token_info_id + 2);
                    word_cost = this.token_info_dictionary.dictionary.getShort(token_info_id + 4);

                    // node_name, cost, start_index, length, type, left_id, right_id, surface_form
                    lattice.append(new ViterbiNode(token_info_id, word_cost, pos + 1, key.length, "KNOWN", left_id, right_id, key));
                }
            }

            // Unknown word processing
            var surrogate_aware_tail = new SurrogateAwareString(tail);
            var head_char = new SurrogateAwareString(surrogate_aware_tail.charAt(0));
            var head_char_class: CharacterClass = this.unknown_dictionary.lookup(head_char.toString());
            if (vocabulary == null || vocabulary.length === 0 || head_char_class.is_always_invoke) {
                // Process unknown word
                key = head_char.toString();
                if (head_char_class.is_grouping && 1 < surrogate_aware_tail.length) {
                    for (var k = 1; k < surrogate_aware_tail.length; k++) {
                        var next_char = surrogate_aware_tail.charAt(k);
                        var next_char_class = this.unknown_dictionary.lookup(next_char);
                        if (head_char_class.class_name !== next_char_class.class_name) {
                            break;
                        }
                        key += next_char;
                    }
                }

                var unk_ids: number[] = this.unknown_dictionary.target_map[head_char_class.class_id];
                for (var j = 0; j < unk_ids.length; j++) {
                    var unk_id = unk_ids[j];

                    left_id = this.unknown_dictionary.dictionary.getShort(unk_id);
                    right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2);
                    word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4);

                    // node_name, cost, start_index, length, type, left_id, right_id, surface_form
                    lattice.append(new ViterbiNode(unk_id, word_cost, pos + 1, key.length, "UNKNOWN", left_id, right_id, key.toString()));
                }
            }
        }
        lattice.appendEos();

        return lattice;
    };
}