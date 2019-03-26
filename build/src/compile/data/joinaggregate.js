import { vgField } from '../../fielddef';
import { duplicate, hash } from '../../util';
import { unique } from './../../util';
import { DataFlowNode } from './dataflow';
/**
 * A class for the join aggregate transform nodes.
 */
export class JoinAggregateTransformNode extends DataFlowNode {
    constructor(parent, transform) {
        super(parent);
        this.transform = transform;
    }
    clone() {
        return new JoinAggregateTransformNode(null, duplicate(this.transform));
    }
    addDimensions(fields) {
        this.transform.groupby = unique(this.transform.groupby.concat(fields), d => d);
    }
    dependentFields() {
        const out = new Set();
        this.transform.groupby.forEach(f => out.add(f));
        this.transform.joinaggregate
            .map(w => w.field)
            .filter(f => f !== undefined)
            .forEach(f => out.add(f));
        return out;
    }
    producedFields() {
        return new Set(this.transform.joinaggregate.map(this.getDefaultName));
    }
    getDefaultName(joinAggregateFieldDef) {
        return joinAggregateFieldDef.as || vgField(joinAggregateFieldDef);
    }
    hash() {
        return `JoinAggregateTransform ${hash(this.transform)}`;
    }
    assemble() {
        const fields = [];
        const ops = [];
        const as = [];
        for (const joinaggregate of this.transform.joinaggregate) {
            ops.push(joinaggregate.op);
            as.push(this.getDefaultName(joinaggregate));
            fields.push(joinaggregate.field === undefined ? null : joinaggregate.field);
        }
        const groupby = this.transform.groupby;
        return Object.assign({ type: 'joinaggregate', as,
            ops,
            fields }, (groupby !== undefined ? { groupby } : {}));
    }
}
//# sourceMappingURL=joinaggregate.js.map