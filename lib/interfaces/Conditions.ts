import {Op, Conditions} from './Enums';

export interface ConditionSet {
    type: Conditions;
    conditions: (string|Op)[][];
}