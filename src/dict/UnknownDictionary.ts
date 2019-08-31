import TokenInfoDictionary, { TargetMap } from './TokenInfoDictionary'
import CharacterDefinition from './CharacterDefinition'
import ByteBuffer from '../util/ByteBuffer'
import CharacterClass from './CharacterClass'


export default class UnknownDictionary extends TokenInfoDictionary{
    dictionary: ByteBuffer;
    target_map: TargetMap;
    pos_buffer: ByteBuffer;
    character_definition: CharacterDefinition;
    /**
     * UnknownDictionary
     * @constructor
     */
    constructor() {
        super();
        this.dictionary = new ByteBuffer(10 * 1024 * 1024);
        this.target_map = new Map<number, number[]>();  // class_id (of CharacterClass) -> token_info_id (of unknown class)
        this.pos_buffer = new ByteBuffer(10 * 1024 * 1024);
        this.character_definition = null;
    }

    characterDefinition(character_definition: CharacterDefinition) {
        this.character_definition = character_definition;
        return this;
    };

    lookup(ch: string) {
        return this.character_definition.lookup(ch);
    };

    lookupCompatibleCategory(ch: string) {
        return this.character_definition.lookupCompatibleCategory(ch);
    };

    loadUnknownDictionaries(unk_buffer: Uint8Array, unk_pos_buffer: Uint8Array, unk_map_buffer: Uint8Array, cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array) {
        this.loadDictionary(unk_buffer);
        this.loadPosVector(unk_pos_buffer);
        this.loadTargetMap(unk_map_buffer);
        this.character_definition = CharacterDefinition.load(cat_map_buffer, compat_cat_map_buffer, invoke_def_buffer);
    };
}