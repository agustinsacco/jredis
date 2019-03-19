import {CallStack} from './CallStack';
import {Collection} from './Collection';

// Interfaces & Enums
import {Op, Commands, Conditions} from './interfaces/Enums';
import {ConditionSet} from './interfaces/Conditions';

export class Mapper {
    private callStack: CallStack;
    private collection: Collection;

    constructor() {
        this.callStack = new CallStack();
        this.collection = new Collection();
    }

    private resetCallStack(): void {
        this.callStack = new CallStack();
    }

    public insert(collection: string, document: Object): Mapper {
        this.resetCallStack();
        if(!collection) {
            throw new Error('Collection not specified.');
        }
        if(!document) {
            throw new Error('Document not specified.');
        }
        if(!(document instanceof Object)) {
            throw new Error('Document must be an object.');
        }
        this.callStack.command = Commands.insert;
        this.callStack.collection = collection;
        this.callStack.document = document;
        return this;
    }

    private async execInsert(): Promise<any> {
        // 1. Insert document in collection
        return this.collection.insert(
            this.callStack.collection, 
            this.callStack.document);
    }

    public async exec(): Promise<any> {
        let result: any = null;
        switch(this.callStack.command) {
            case Commands.insert:
                result = this.execInsert();
            default:
                break;
        }
        this.resetCallStack();
        return result;
    }

    public update(collection: string): Mapper {
        this.resetCallStack();
        if(!collection) {
            throw new Error('Collection not specified in update command.');
        }
        this.callStack.command = Commands.update;
        this.callStack.collection = collection;
        return this;
    }

    public select(collection: string): Mapper {
        this.resetCallStack();
        if(!collection) {
            throw new Error('Collection not specified.');
        }
        this.callStack.command = Commands.select;
        this.callStack.collection = collection;
        return this;
    }

    public where(...conditionSets: ConditionSet[]) {
        if(!this.callStack.collection) {
            throw new Error('Collection not specified.');
        }
        if(conditionSets.length === 0) {
            throw new Error('Condition set is empty.');
        }
        for(let x=0; x<conditionSets.length; x++) {
            this.callStack.conditions.push(conditionSets[x]);
        }
        return this;
    }

    public andX(...conditionSet: (string|Op)[][]): ConditionSet {
        return {
            type: Conditions.and,
            conditions: conditionSet
        };
    }

    public orX(...conditionSet: (string|Op)[][]): ConditionSet {
        return {
            type: Conditions.or,
            conditions: conditionSet
        };
    }

    public eq(attr: string, value: any): (string|Op)[] {
        return [
            attr,
            Op.eq,
            value
        ]
    }

    public neq(attr: string, value: any): (string|Op)[] {
        return [
            attr,
            Op.neq,
            value
        ]
    }

    public getCallStack(): CallStack {
        return this.callStack;
    }
}