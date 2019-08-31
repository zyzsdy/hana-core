// Array utility functions
export type DATArrayBuffer = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array;
export function newArrayBuffer(signed: boolean, bytes: number, size: number): DATArrayBuffer {
    if (signed) {
        switch(bytes) {
            case 1:
            return new Int8Array(size);
            case 2:
            return new Int16Array(size);
            case 4:
            return new Int32Array(size);
            default:
            throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
        }
    } else {
        switch(bytes) {
            case 1:
            return new Uint8Array(size);
            case 2:
            return new Uint16Array(size);
            case 4:
            return new Uint32Array(size);
            default:
            throw new RangeError("Invalid newArray parameter element_bytes:" + bytes);
        }
    }
};

export function arrayCopy(src: Uint8Array, src_offset: number, length: number): Uint8Array {
    var buffer = new ArrayBuffer(length);
    var dstU8 = new Uint8Array(buffer, 0, length);
    var srcU8 = src.subarray(src_offset, length);
    dstU8.set(srcU8);
    return dstU8;
};
