import newBC from './bc'
import { DATArrayBuffer } from './arrayutil';
import DoubleArrayBuilder from './doublearraybuilder'
import DoubleArray from './doublearray'

export default class DAT{
    static builder(initial_size: number = 1024) {
        return new DoubleArrayBuilder(initial_size);
    }
    static load(base_buffer: DATArrayBuffer, check_buffer: DATArrayBuffer) {
        var bc = newBC(0);
        bc.loadBaseBuffer(base_buffer);
        bc.loadCheckBuffer(check_buffer);
        return new DoubleArray(bc);
    }
}
