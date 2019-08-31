import Tokenizer from './Tokenizer'
import DictionaryLoader from './loader/DictionaryLoader'

export interface TokenizerBuilderOption{
    dicPath?: string;
}

export default class TokenizerBuilder{
    dic_path: string;
    /**
     * TokenizerBuilder create Tokenizer instance.
     * @param {Object} option JSON object which have key-value pairs settings
     * @param {string} option.dicPath Dictionary directory path (or URL using in browser)
     * @constructor
     */
    constructor(option: TokenizerBuilderOption) {
        if (option.dicPath == null) {
            this.dic_path = "dict/";
        } else {
            this.dic_path = option.dicPath;
        }
    }

    /**
     * Build Tokenizer instance by asynchronous manner
     * @param {TokenizerBuilder~onLoad} callback Callback function
     */
    build(callback: (err: any, tokenizer: Tokenizer) => void) {
        var loader = new DictionaryLoader(this.dic_path);
        loader.load(function (err, dic) {
            callback(err, new Tokenizer(dic));
        });
    };

    /**
     * Callback used by build
     * @callback TokenizerBuilder~onLoad
     * @param {Object} err Error object
     * @param {Tokenizer} tokenizer Prepared Tokenizer
     */
}