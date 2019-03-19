import {Op, Commands, Conditions} from './interfaces/Enums';
import {ConditionSet} from './interfaces/Conditions';

export class CallStack {
    public command: Commands;
    public collection: string;
    public conditions: ConditionSet[];
    public document: any;
    public limit: number;
    public skip: number;

    constructor() {
        this.collection = '';
        this.conditions = [];
        this.document = {};
        this.limit = -1;
        this.skip = -1;
    }
}