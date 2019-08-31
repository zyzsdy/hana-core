import ViterbiNode from './ViterbiNode'

export default class ViterbiLattice{
    nodes_end_at: ViterbiNode[][];
    eos_pos: number;
    /**
     * ViterbiLattice is a lattice in Viterbi algorithm
     * @constructor
     */
    constructor() {
        this.nodes_end_at = [];
        this.nodes_end_at[0] = [ new ViterbiNode(-1, 0, 0, 0, "BOS", 0, 0, "") ];
        this.eos_pos = 1;
    }

    /**
     * Append node to ViterbiLattice
     * @param {ViterbiNode} node
     */
    append(node: ViterbiNode) {
        var last_pos = node.start_pos + node.length - 1;
        if (this.eos_pos < last_pos) {
            this.eos_pos = last_pos;
        }

        var prev_nodes = this.nodes_end_at[last_pos];
        if (prev_nodes == null) {
            prev_nodes = [];
        }
        prev_nodes.push(node);

        this.nodes_end_at[last_pos] = prev_nodes;
    };

    /**
     * Set ends with EOS (End of Statement)
     */
    appendEos() {
        var last_index = this.nodes_end_at.length;
        this.eos_pos++;
        this.nodes_end_at[last_index] = [ new ViterbiNode(-1, 0, this.eos_pos, 0, "EOS", 0, 0, "") ];
    };
}