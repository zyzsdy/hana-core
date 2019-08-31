import ConnectionCosts from '../ConnectionCosts'

export default class ConnectionCostsBuilder{
    lines: number;
    connection_cost: ConnectionCosts;
    /**
     * Builder class for constructing ConnectionCosts object
     * @constructor
     */
    constructor() {
        this.lines = 0;
        this.connection_cost = null;
    }

    putLine(line: string) {
        if (this.lines === 0) {
            var dimensions = line.split(" ");
            var forward_dimension = parseInt(dimensions[0]);
            var backward_dimension = parseInt(dimensions[1]);

            if (forward_dimension < 0 || backward_dimension < 0) {
                throw "Parse error of matrix.def";
            }

            this.connection_cost = new ConnectionCosts(forward_dimension, backward_dimension);
            this.lines++;
            return this;
        }

        var costs = line.split(" ");

        if (costs.length !== 3) {
            return this;
        }

        var forward_id = parseInt(costs[0]);
        var backward_id = parseInt(costs[1]);
        var cost = parseInt(costs[2]);

        if (forward_id < 0 || backward_id < 0 || !isFinite(forward_id) || !isFinite(backward_id) ||
            this.connection_cost.forward_dimension <= forward_id || this.connection_cost.backward_dimension <= backward_id) {
            throw "Parse error of matrix.def";
        }

        this.connection_cost.put(forward_id, backward_id, cost);
        this.lines++;
        return this;
    };

    build() {
        return this.connection_cost;
    };
}