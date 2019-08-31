import ConnectionCosts from "../dict/ConnectionCosts";
import ViterbiLattice from "./ViterbiLattice";
import ViterbiNode from "./ViterbiNode";

export default class ViterbiSearcher{
    connection_costs: ConnectionCosts
    /**
     * ViterbiSearcher is for searching best Viterbi path
     * @param {ConnectionCosts} connection_costs Connection costs matrix
     * @constructor
     */
    constructor(connection_costs: ConnectionCosts) {
        this.connection_costs = connection_costs;
    }

    /**
     * Search best path by forward-backward algorithm
     * @param {ViterbiLattice} lattice Viterbi lattice to search
     * @returns {Array} Shortest path
     */
    search(lattice: ViterbiLattice): ViterbiNode[] {
        lattice = this.forward(lattice);
        return this.backward(lattice);
    };

    forward(lattice: ViterbiLattice) {
        var i: number, j: number, k: number;
        for (i = 1; i <= lattice.eos_pos; i++) {
            var nodes: ViterbiNode[] = lattice.nodes_end_at[i];
            if (nodes == null) {
                continue;
            }
            for (j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var cost = Number.MAX_VALUE;
                var shortest_prev_node: ViterbiNode;

                var prev_nodes = lattice.nodes_end_at[node.start_pos - 1];
                if (prev_nodes == null) {
                    // TODO process unknown words (repair word lattice)
                    continue;
                }
                for (k = 0; k < prev_nodes.length; k++) {
                    var prev_node = prev_nodes[k];

                    var edge_cost: number;
                    if (node.left_id == null || prev_node.right_id == null) {
                        // TODO assert
                        console.log("Left or right is null");
                        edge_cost = 0;
                    } else {
                        edge_cost = this.connection_costs.get(prev_node.right_id, node.left_id);
                    }

                    var _cost = prev_node.shortest_cost + edge_cost + node.cost;
                    if (_cost < cost) {
                        shortest_prev_node = prev_node;
                        cost = _cost;
                    }
                }

                node.prev = shortest_prev_node;
                node.shortest_cost = cost;
            }
        }
        return lattice;
    };

    backward(lattice: ViterbiLattice) {
        var shortest_path: ViterbiNode[] = [];
        var eos = lattice.nodes_end_at[lattice.nodes_end_at.length - 1][0];

        var node_back = eos.prev;
        if (node_back == null) {
            return [];
        }
        while (node_back.type !== "BOS") {
            shortest_path.push(node_back);
            if (node_back.prev == null) {
                // TODO Failed to back. Process unknown words?
                return [];
            }
            node_back = node_back.prev;
        }

        return shortest_path.reverse();
    };
}