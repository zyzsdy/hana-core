

export default class ConnectionCosts{
    forward_dimension: number;
    backward_dimension: number;
    buffer: Int16Array;
    /**
     * Connection costs matrix from cc.dat file.
     * 2 dimension matrix [forward_id][backward_id] -> cost
     * @constructor
     * @param {number} forward_dimension
     * @param {number} backward_dimension
     */
    constructor(forward_dimension: number, backward_dimension: number) {
        this.forward_dimension = forward_dimension;
        this.backward_dimension = backward_dimension;

        // leading 2 integers for forward_dimension, backward_dimension, respectively
        this.buffer = new Int16Array(forward_dimension * backward_dimension + 2);
        this.buffer[0] = forward_dimension;
        this.buffer[1] = backward_dimension;
    }

    put(forward_id: number, backward_id: number, cost: number) {
        var index = forward_id * this.backward_dimension + backward_id + 2;
        if (this.buffer.length < index + 1) {
            throw "ConnectionCosts buffer overflow";
        }
        this.buffer[index] = cost;
    };

    get(forward_id: number, backward_id: number) {
        var index = forward_id * this.backward_dimension + backward_id + 2;
        if (this.buffer.length < index + 1) {
            throw "ConnectionCosts buffer overflow";
        }
        return this.buffer[index];
    };

    loadConnectionCosts(connection_costs_buffer: Int16Array) {
        this.forward_dimension = connection_costs_buffer[0];
        this.backward_dimension = connection_costs_buffer[1];
        this.buffer = connection_costs_buffer;
    };
}