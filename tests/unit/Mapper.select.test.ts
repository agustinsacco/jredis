import * as Redis from 'redis';
import { expect } from 'chai';
import {Op, Commands, Conditions} from '../../lib/interfaces/Enums';
import {ConditionSet} from '../../lib/interfaces/Conditions';
import {Mapper} from '../../lib/Mapper';

describe('Unit - Mapper() -> select()', () => {
    before(() => {
        this.client = Redis.createClient(
            6379,
            'localhost'
        );
    });
    describe('eq() neq() andX() orX()', () => {
        beforeEach(() => {
            this.jmap = new Mapper();
        });
        it('eq()', () => {
            const eq = this.jmap.eq('name', 'A');
            expect(eq).to.have.ordered.members([
                'name',
                Op.eq,
                'A'
            ]);
        });
        it('neq()', () => {
            const neq = this.jmap.neq('name', 'A');
            expect(neq).to.have.ordered.members([
                'name',
                Op.neq,
                'A'
            ]);
        });
        it('andX()', () => {
            let andX = this.jmap.andX(
                this.jmap.eq('name', 'A'),
                this.jmap.eq('price', 50),
            );
            const andXFixture: ConditionSet = { 
                type: Conditions.and,
                conditions: [ 
                    [ 'name', 0, 'A' ], 
                    [ 'price', 0, 50 ] 
                ] 
            };
            expect(andX).to.deep.equal(andXFixture);
        });
        it('orX()', () => {
            let orX = this.jmap.orX(
                this.jmap.eq('name', 'A'),
                this.jmap.eq('price', 50),
            );
            const orXFixture: ConditionSet = { 
                type: Conditions.or,
                conditions: [ 
                    [ 'name', 0, 'A' ], 
                    [ 'price', 0, 50 ] 
                ] 
            };
            expect(orX).to.deep.equal(orXFixture);
        });
    });
    describe('select()', () => {
        beforeEach(() => {
            this.jmap = new Mapper();
        });
        it('test throws error "Collection not specified."', () => {
            expect(() => 
                this.jmap.select('')
            ).to.throw('Collection not specified.');
            expect(() => 
                this.jmap.select()
            ).to.throw('Collection not specified.');
            expect(() => 
                this.jmap.select(undefined)
            ).to.throw('Collection not specified.');
        });
        it('test returns instance of Mapper', () => {
            const mapper = this.jmap.select('user');
            expect(mapper).to.be.an.instanceof(Mapper);
        });
        it('test callstack collection set to "user"', () => {
            const mapper = this.jmap.select('user');
            expect(this.jmap.getCallStack().collection).to.equal('user');
        });
    });
    describe('where()', () => {
        beforeEach(() => {
            this.jmap = new Mapper();
        });
        it('test throws error "Collection not specified."', () => {
            expect(() => 
                this.jmap.where(
                    this.jmap.orX(
                        this.jmap.eq('name', 'B'),
                        this.jmap.eq('price', 70),
                    )                     
                )
            ).to.throw('Collection not specified.');
        });
        it('test throws error "Condition set is empty."', () => {
            expect(() => 
                this.jmap
                    .select('user')
                    .where()
            ).to.throw('Condition set is empty.');
        });
        it('test callstack "and" conditions are set', () => {
            this.jmap
                .select('user')
                .where(
                    this.jmap.andX(
                        this.jmap.eq('name', 'foobar'),
                        this.jmap.neq('email', 'foo@bar.com'),
                        this.jmap.eq('age', 26),
                    )
                )
            const conditions = [{ 
                type: Conditions.and, 
                conditions: [
                    ['name', Op.eq, 'foobar'],
                    ['email', Op.neq, 'foo@bar.com'],
                    ['age', Op.eq, 26],
                ]
            }];
            expect(this.jmap.getCallStack().conditions).to.deep.equal(conditions);            
        });
        it('test callstack "and" "or" combination conditions are set', () => {
            this.jmap
                .select('user')
                .where(
                    this.jmap.andX(
                        this.jmap.eq('name', 'foobar'),
                        this.jmap.neq('email', 'foo@bar.com'),
                    ),
                    this.jmap.orX(
                        this.jmap.eq('name', 'bazboz'),
                    )
                );
            const conditions = [
                { 
                    type: Conditions.and, 
                    conditions: [
                        ['name', Op.eq, 'foobar'],
                        ['email', Op.neq, 'foo@bar.com'],
                    ],
                },
                { 
                    type: Conditions.or, 
                    conditions: [
                        ['name', Op.eq, 'bazboz'],
                    ],
                }
            ];
            expect(this.jmap.getCallStack().conditions).to.deep.equal(conditions);            
        });
    });
});

