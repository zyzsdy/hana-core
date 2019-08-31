export default class CharacterClass{
    class_id: number;
    class_name: string;
    is_always_invoke: boolean;
    is_grouping: boolean;
    max_length: number;
    /**
     * CharacterClass
     * @param {number} class_id
     * @param {string} class_name
     * @param {boolean} is_always_invoke
     * @param {boolean} is_grouping
     * @param {number} max_length
     * @constructor
     */
    constructor(class_id: number, class_name: string, is_always_invoke: boolean, is_grouping: boolean, max_length: number) {
        this.class_id = class_id;
        this.class_name = class_name;
        this.is_always_invoke = is_always_invoke;
        this.is_grouping = is_grouping;
        this.max_length = max_length;
    }
}