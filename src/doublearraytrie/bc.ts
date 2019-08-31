import { MEMORY_EXPAND_RATIO,
    ROOT_ID,
    BASE_SIGNED,
    BASE_BYTES,
    CHECK_SIGNED,
    CHECK_BYTES } from './genericparameters'
import { newArrayBuffer, DATArrayBuffer } from './arrayutil'

export interface DATArray{
    signed: boolean;
    bytes: number;
    array: DATArrayBuffer
}
export class BC{
    initial_size = 1024;
    first_unused_node = ROOT_ID + 1;
    base: DATArray = {
        signed: BASE_SIGNED,
        bytes: BASE_BYTES,
        array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, this.initial_size)
    };
    check: DATArray = {
        signed: CHECK_SIGNED,
        bytes: CHECK_BYTES,
        array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, this.initial_size)
    };
    _realloc(min_size: number) {
        // expand arrays size by given ratio
        var new_size = min_size * MEMORY_EXPAND_RATIO;
        // console.log('re-allocate memory to ' + new_size);

        var base_new_array = newArrayBuffer(this.base.signed, this.base.bytes, new_size);
        this._initBase(base_new_array, this.base.array.length, new_size);  // init BASE in new range
        base_new_array.set(this.base.array);
        this.base.array = null;  // explicit GC
        this.base.array = base_new_array;

        var check_new_array = newArrayBuffer(this.check.signed, this.check.bytes, new_size);
        this._initCheck(check_new_array, this.check.array.length, new_size);  // init CHECK in new range
        check_new_array.set(this.check.array);
        this.check.array = null;  // explicit GC
        this.check.array = check_new_array;
    };
    _initBase(_base: DATArrayBuffer, start: number, end: number) {  // 'end' index does not include
        for (var i = start; i < end; i++) {
            _base[i] = - i + 1;  // inversed previous empty node index
        }
        if (0 < this.check.array[this.check.array.length - 1]) {
            var last_used_id = this.check.array.length - 2;
            while (0 < this.check.array[last_used_id]) {
                last_used_id--;
            }
            _base[start] = - last_used_id;
        }
    };
    _initCheck(_check: DATArrayBuffer, start: number, end: number) {
        for (var i = start; i < end; i++) {
            _check[i] = - i - 1;  // inversed next empty node index
        }
    };
    constructor(initial_size: number){
        if (initial_size == null) {
            this.initial_size = 1024;
        }
    
        // init root node
        this.base.array[ROOT_ID] = 1;
        this.check.array[ROOT_ID] = ROOT_ID;
    
        // init BASE
        this._initBase(this.base.array, ROOT_ID + 1, this.base.array.length);
    
        // init CHECK
        this._initCheck(this.check.array, ROOT_ID + 1, this.check.array.length);
    }
    getBaseBuffer() {
        return this.base.array;
    }
    getCheckBuffer() {
        return this.check.array;
    }
    loadBaseBuffer(base_buffer: DATArrayBuffer) {
        this.base.array = base_buffer;
        return this;
    }
    loadCheckBuffer(check_buffer: DATArrayBuffer) {
        this.check.array = check_buffer;
        return this;
    }
    size() {
        return Math.max(this.base.array.length, this.check.array.length);
    }
    getBase(index: number) {
        if (this.base.array.length - 1 < index) {
            return - index + 1;
            // realloc(index);
        }
        // if (!Number.isFinite(base.array[index])) {
        //     console.log('getBase:' + index);
        //     throw 'getBase' + index;
        // }
        return this.base.array[index];
    }
    getCheck(index: number) {
        if (this.check.array.length - 1 < index) {
            return - index - 1;
            // realloc(index);
        }
        // if (!Number.isFinite(check.array[index])) {
        //     console.log('getCheck:' + index);
        //     throw 'getCheck' + index;
        // }
        return this.check.array[index];
    }
    setBase(index: number, base_value: number) {
        if (this.base.array.length - 1 < index) {
            this._realloc(index);
        }
        this.base.array[index] = base_value;
    }
    setCheck(index: number, check_value: number) {
        if (this.check.array.length - 1 < index) {
            this._realloc(index);
        }
        this.check.array[index] = check_value;
    }
    setFirstUnusedNode(index: number) {
        // if (!Number.isFinite(index)) {
        //     throw 'assertion error: setFirstUnusedNode ' + index + ' is not finite number';
        // }
        this.first_unused_node = index;
    }
    getFirstUnusedNode() {
        // if (!Number.isFinite(first_unused_node)) {
        //     throw 'assertion error: getFirstUnusedNode ' + first_unused_node + ' is not finite number';
        // }
        return this.first_unused_node;
    }
    shrink() {
        var last_index = this.size() - 1;
        while (true) {
            if (0 <= this.check.array[last_index]) {
                break;
            }
            last_index--;
        }
        this.base.array = this.base.array.subarray(0, last_index + 2);   // keep last unused node
        this.check.array = this.check.array.subarray(0, last_index + 2); // keep last unused node
    }
    calc() {
        var unused_count = 0;
        var size = this.check.array.length;
        for (var i = 0; i < size; i++) {
            if (this.check.array[i] < 0) {
                unused_count++;
            }
        }
        return {
            all: size,
            unused: unused_count,
            efficiency: (size - unused_count) / size
        };
    }
    dump() {
        // for debug
        var dump_base = "";
        var dump_check = "";

        var i;
        for (i = 0; i < this.base.array.length; i++) {
            dump_base = dump_base + " " + this.getBase(i);
        }
        for (i = 0; i < this.check.array.length; i++) {
            dump_check = dump_check + " " + this.getCheck(i);
        }

        console.log("base:" + dump_base);
        console.log("chck:" + dump_check);

        return "base:" + dump_base + " chck:" + dump_check;
    }
}

export default function newBC(initial_size: number) {
    return new BC(initial_size);
};