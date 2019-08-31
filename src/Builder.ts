import TokenizerBuilder, { TokenizerBuilderOption } from './TokenizerBuilder'
import DictionaryBuilder from './dict/builder/DictionaryBuilder'

export default {
    builder: function(option: TokenizerBuilderOption){
        return new TokenizerBuilder(option);
    },
    dictionaryBuilder: function(){
        return new DictionaryBuilder();
    }
}