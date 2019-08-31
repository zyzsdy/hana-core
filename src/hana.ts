import Builder from './Builder'
import Tokenizer from './Tokenizer'
import { IpadicToken } from './util/IpadicFormatter'
import isJapanese from './romajitools/isJapanese'
import toKatakana from './romajitools/toKatakana'
import toRomaji from './romajitools/toRomaji'

export interface HanaOption{
    dicPath?: string;
}

export default class Hana{
    option: HanaOption = {};
    tokenizer: Tokenizer;
    constructor(option: HanaOption = {}){
        this.option.dicPath = option.dicPath || "dicts";
    }
    init(callback: (err: any, tokenizer: Tokenizer, self: this) => void){
        Builder.builder({dicPath: this.option.dicPath}).build((err, tokenizer) => {
            if(err) callback(err, null, this);
            this.tokenizer = tokenizer;
            callback(null, tokenizer, this);
        });
    }
    convert(str: string, prop: string = 'pronunciation'){
        var tokens = this.tokenizer.tokenize(str);
        for(var cr in tokens){
            if(!tokens[cr][prop]){
                if(isJapanese(tokens[cr].surface_form)){
                    tokens[cr][prop] = toKatakana(tokens[cr].surface_form)
                }
                else{
                    tokens[cr][prop] = tokens[cr].surface_form;
                }
            }
        }

        return toRomaji(splitObjArray(tokens, 'pronunciation', ' '));
    }
}

function splitObjArray(arr: IpadicToken[], prop: string, split: string = ''): string {
    return arr.filter(i => !(/\s+/.test(i[prop]))).map(i => i[prop]).join(split);
};