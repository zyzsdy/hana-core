import ViterbiBuilder from './viterbi/ViterbiBuilder'
import ViterbiSearcher from './viterbi/ViterbiSearcher'
import IpadicFormatter, { IpadicToken } from './util/IpadicFormatter'
import DynamicDictionaries from './dict/DynamicDictionaries';
import TokenInfoDictionary from './dict/TokenInfoDictionary';
import UnknownDictionary from './dict/UnknownDictionary';
import ViterbiLattice from './viterbi/ViterbiLattice';
import ViterbiNode from './viterbi/ViterbiNode';

const PUNCTUATION = /、|。/;

export default class Tokenizer{
    token_info_dictionary: TokenInfoDictionary;
    unknown_dictionary: UnknownDictionary;
    viterbi_builder: ViterbiBuilder;
    viterbi_searcher: ViterbiSearcher;
    formatter: IpadicFormatter;
    /**
     * Tokenizer
     * @param {DynamicDictionaries} dic Dictionaries used by this tokenizer
     * @constructor
     */
    constructor(dic: DynamicDictionaries) {
        this.token_info_dictionary = dic.token_info_dictionary;
        this.unknown_dictionary = dic.unknown_dictionary;
        this.viterbi_builder = new ViterbiBuilder(dic);
        this.viterbi_searcher = new ViterbiSearcher(dic.connection_costs);
        this.formatter = new IpadicFormatter();  // TODO Other dictionaries
    }

    /**
     * Split into sentence by punctuation
     * @param {string} input Input text
     * @returns {Array.<string>} Sentences end with punctuation
     */
    static splitByPunctuation(input: string): string[] {
        var sentences: string[] = [];
        var tail = input;
        while (true) {
            if (tail === "") {
                break;
            }
            var index = tail.search(PUNCTUATION);
            if (index < 0) {
                sentences.push(tail);
                break;
            }
            sentences.push(tail.substring(0, index + 1));
            tail = tail.substring(index + 1);
        }
        return sentences;
    };

    /**
     * Tokenize text
     * @param {string} text Input text to analyze
     * @returns {Array} Tokens
     */
    tokenize(text: string): IpadicToken[] {
        var sentences = Tokenizer.splitByPunctuation(text);
        var tokens: IpadicToken[] = [];
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            this.tokenizeForSentence(sentence, tokens);
        }
        return tokens;
    };

    tokenizeForSentence(sentence: string, tokens: IpadicToken[]) {
        if (tokens == null) {
            tokens = [];
        }
        var lattice = this.getLattice(sentence);
        var best_path: ViterbiNode[] = this.viterbi_searcher.search(lattice);
        var last_pos = 0;
        if (tokens.length > 0) {
            last_pos = tokens[tokens.length - 1].word_position;
        }

        for (var j = 0; j < best_path.length; j++) {
            var node = best_path[j];

            var token: IpadicToken, features: string[], features_line: string;
            if (node.type === "KNOWN") {
                features_line = this.token_info_dictionary.getFeatures(node.name);
                if (features_line == null) {
                    features = [];
                } else {
                    features = features_line.split(",");
                }
                token = this.formatter.formatEntry(node.name, last_pos + node.start_pos, node.type, features);
            } else if (node.type === "UNKNOWN") {
                // Unknown word
                features_line = this.unknown_dictionary.getFeatures(node.name);
                if (features_line == null) {
                    features = [];
                } else {
                    features = features_line.split(",");
                }
                token = this.formatter.formatUnknownEntry(node.name, last_pos + node.start_pos, node.type, features, node.surface_form);
            } else {
                // TODO User dictionary
                token = this.formatter.formatEntry(node.name, last_pos + node.start_pos, node.type, []);
            }

            tokens.push(token);
        }

        return tokens;
    };

    /**
     * Build word lattice
     * @param {string} text Input text to analyze
     * @returns {ViterbiLattice} Word lattice
     */
    getLattice(text: string): ViterbiLattice {
        return this.viterbi_builder.build(text);
    };
}