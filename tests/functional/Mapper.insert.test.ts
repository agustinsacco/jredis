import * as Redis from 'redis';
import * as md5 from 'md5';
import {RedisUtil} from '../../lib/utilities/RedisUtil';
import { expect } from 'chai';
import {Op, Commands, Conditions} from '../../lib/interfaces/Enums';
import {Mapper} from '../../lib/Mapper';

describe('Mapper() - Functional', () => {
    before(() => {
        this.fixture = {
            collection: 'users',
            documents: [
                {
                    name: 'Smith',
                    email: 'smith@foobar.com',
                    age: 25,
                    testObj: {
                        foo: 'bar'
                    },
                    testArr: [1,2,3]
                },
                {
                    name: 'Johnson',
                    email: 'johnson@foobar.com',
                    age: 32,
                    testObj: {
                        foo: 'baz'
                    },
                    testArr: [1,2,3,4]
                },
                {
                    name: 'Johnson',
                    email: 'johnson@barbaz.com',
                    age: 22,
                    testObj: {
                        bar: 'baz'
                    },
                    testArr: [2,3,4]
                },
                {
                    name: 'Williams',
                    email: 'williams@foobar.com',
                    age: 32,
                    testObj: {
                        foo: 'bar',
                        bar: 'baz'
                    },
                    testArr: [1,2,3]
                },
                {
                    name: 'Brown',
                    email: 'brown@foobaz.com',
                    age: 32,
                    testObj: {
                        bar: 'baz'
                    },
                    testArr: [1,2,3]
                }
            ]
        };
        this.client = new RedisUtil();
        this.client.flushall();
    });
    describe('insert()', () => {
        before(() => {
            this.jmap = new Mapper();
        });
        it(`Insertion #1`, async () => {
            const documentId = 1;
            const document = this.fixture.documents[documentId - 1];

            // Insert document
            const result = await this.jmap
                .insert(this.fixture.collection, document)
                .exec();

            // Check document stored in collection
            expect(await this.client.get(`${this.fixture.collection}:${documentId}`)).to.equal(JSON.stringify(document));

            // Check last collection id
            expect(await this.client.get(`${this.fixture.collection}:last`)).to.equal(documentId.toString());

            // Check name index
            const nameIndexKey = `${this.fixture.collection}:name:${md5(document.name.toString())}`;
            expect(await this.client.exists(nameIndexKey)).to.equal(1);
            expect(await this.client.smembers(nameIndexKey)).to.have.ordered.members(['1']);

            // Check email index
            const emailIndexKey = `${this.fixture.collection}:email:${md5(document.email.toString())}`;
            expect(await this.client.exists(emailIndexKey)).to.equal(1);
            expect(await this.client.smembers(emailIndexKey)).to.have.ordered.members(['1']);

            const ageIndexKey = `${this.fixture.collection}:age:${md5(document.age.toString())}`;
            expect(await this.client.exists(ageIndexKey)).to.equal(1);
            expect(await this.client.smembers(ageIndexKey)).to.have.ordered.members(['1']);

            // Check testArr index
            const testArrIndexKey = `${this.fixture.collection}:testArr:${md5(JSON.stringify(document.testArr))}`;
            expect(await this.client.exists(testArrIndexKey)).to.equal(1);
            expect(await this.client.smembers(testArrIndexKey)).to.have.ordered.members(['1']);
            
            // Check testObj index
            const testObjIndexKey = `${this.fixture.collection}:testObj:${md5(JSON.stringify(document.testObj))}`;
            expect(await this.client.exists(testObjIndexKey)).to.equal(1);
            expect(await this.client.smembers(testObjIndexKey)).to.have.ordered.members(['1']);
        });
        it(`Insertion #2`, async () => {
            const documentId = 2;
            const document = this.fixture.documents[documentId - 1];
            
            // Insert document
            const result = await this.jmap
                .insert(this.fixture.collection, document)
                .exec();

            // Check document stored in collection
            expect(await this.client.get(`${this.fixture.collection}:${documentId}`)).to.equal(JSON.stringify(document));

            // Check last collection id
            expect(await this.client.get(`${this.fixture.collection}:last`)).to.equal(documentId.toString());
            
            // Check name index
            const nameIndexKey = `${this.fixture.collection}:name:${md5(document.name.toString())}`;
            expect(await this.client.exists(nameIndexKey)).to.equal(1);
            expect(await this.client.smembers(nameIndexKey)).to.have.ordered.members(['2']);

            // Check email index
            const emailIndexKey = `${this.fixture.collection}:email:${md5(document.email.toString())}`;
            expect(await this.client.exists(emailIndexKey)).to.equal(1);
            expect(await this.client.smembers(emailIndexKey)).to.have.ordered.members(['2']);

            const ageIndexKey = `${this.fixture.collection}:age:${md5(document.age.toString())}`;
            expect(await this.client.exists(ageIndexKey)).to.equal(1);
            expect(await this.client.smembers(ageIndexKey)).to.have.ordered.members(['2']);

            // Check testArr index
            const testArrIndexKey = `${this.fixture.collection}:testArr:${md5(JSON.stringify(document.testArr))}`;
            expect(await this.client.exists(testArrIndexKey)).to.equal(1);
            expect(await this.client.smembers(testArrIndexKey)).to.have.ordered.members(['2']);
            
            // Check testObj index
            const testObjIndexKey = `${this.fixture.collection}:testObj:${md5(JSON.stringify(document.testObj))}`;
            expect(await this.client.exists(testObjIndexKey)).to.equal(1);
            expect(await this.client.smembers(testObjIndexKey)).to.have.ordered.members(['2']);
        });
        it(`Insertion #3`, async () => {
            const documentId = 3;
            const document = this.fixture.documents[documentId - 1];

            // Insert document
            const result = await this.jmap
                .insert(this.fixture.collection, document)
                .exec();

            // Check document stored in collection
            expect(await this.client.get(`${this.fixture.collection}:${documentId}`)).to.equal(JSON.stringify(document));

            // Check last collection id
            expect(await this.client.get(`${this.fixture.collection}:last`)).to.equal(documentId.toString());
            
            // Check name index
            const nameIndexKey = `${this.fixture.collection}:name:${md5(document.name.toString())}`;
            expect(await this.client.exists(nameIndexKey)).to.equal(1);
            expect(await this.client.smembers(nameIndexKey)).to.have.ordered.members(['2', '3']);

            // Check email index
            const emailIndexKey = `${this.fixture.collection}:email:${md5(document.email.toString())}`;
            expect(await this.client.exists(emailIndexKey)).to.equal(1);
            expect(await this.client.smembers(emailIndexKey)).to.have.ordered.members(['3']);

            const ageIndexKey = `${this.fixture.collection}:age:${md5(document.age.toString())}`;
            expect(await this.client.exists(ageIndexKey)).to.equal(1);
            expect(await this.client.smembers(ageIndexKey)).to.have.ordered.members(['3']);

            // Check testArr index
            const testArrIndexKey = `${this.fixture.collection}:testArr:${md5(JSON.stringify(document.testArr))}`;
            expect(await this.client.exists(testArrIndexKey)).to.equal(1);
            expect(await this.client.smembers(testArrIndexKey)).to.have.ordered.members(['3']);
            
            // Check testObj index
            const testObjIndexKey = `${this.fixture.collection}:testObj:${md5(JSON.stringify(document.testObj))}`;
            expect(await this.client.exists(testObjIndexKey)).to.equal(1);
            expect(await this.client.smembers(testObjIndexKey)).to.have.ordered.members(['3']);
        });
        it(`Insertion #4`, async () => {
            const documentId = 4;
            const document = this.fixture.documents[documentId - 1];

            // Insert document
            const result = await this.jmap
                .insert(this.fixture.collection, document)
                .exec();

            // Check document stored in collection
            expect(await this.client.get(`${this.fixture.collection}:${documentId}`)).to.equal(JSON.stringify(document));

            // Check last collection id
            expect(await this.client.get(`${this.fixture.collection}:last`)).to.equal(documentId.toString());
            
            // Check name index
            const nameIndexKey = `${this.fixture.collection}:name:${md5(document.name.toString())}`;
            expect(await this.client.exists(nameIndexKey)).to.equal(1);
            expect(await this.client.smembers(nameIndexKey)).to.have.ordered.members(['4']);

            // Check email index
            const emailIndexKey = `${this.fixture.collection}:email:${md5(document.email.toString())}`;
            expect(await this.client.exists(emailIndexKey)).to.equal(1);
            expect(await this.client.smembers(emailIndexKey)).to.have.ordered.members(['4']);

            const ageIndexKey = `${this.fixture.collection}:age:${md5(document.age.toString())}`;
            expect(await this.client.exists(ageIndexKey)).to.equal(1);
            expect(await this.client.smembers(ageIndexKey)).to.have.ordered.members(['2', '4']);

            // Check testArr index
            const testArrIndexKey = `${this.fixture.collection}:testArr:${md5(JSON.stringify(document.testArr))}`;
            expect(await this.client.exists(testArrIndexKey)).to.equal(1);
            expect(await this.client.smembers(testArrIndexKey)).to.have.ordered.members(['1', '4']);
            
            // Check testObj index
            const testObjIndexKey = `${this.fixture.collection}:testObj:${md5(JSON.stringify(document.testObj))}`;
            expect(await this.client.exists(testObjIndexKey)).to.equal(1);
            expect(await this.client.smembers(testObjIndexKey)).to.have.ordered.members(['4']);
        });
        it(`Insertion #5`, async () => {
            const documentId = 5;
            const document = this.fixture.documents[documentId - 1];

            // Insert document
            const result = await this.jmap
                .insert(this.fixture.collection, document)
                .exec();

            // Check document stored in collection
            expect(await this.client.get(`${this.fixture.collection}:${documentId}`)).to.equal(JSON.stringify(document));

            // Check last collection id
            expect(await this.client.get(`${this.fixture.collection}:last`)).to.equal(documentId.toString());
            
            // Check name index
            const nameIndexKey = `${this.fixture.collection}:name:${md5(document.name.toString())}`;
            expect(await this.client.exists(nameIndexKey)).to.equal(1);
            expect(await this.client.smembers(nameIndexKey)).to.have.ordered.members(['5']);

            // Check email index
            const emailIndexKey = `${this.fixture.collection}:email:${md5(document.email.toString())}`;
            expect(await this.client.exists(emailIndexKey)).to.equal(1);
            expect(await this.client.smembers(emailIndexKey)).to.have.ordered.members(['5']);

            const ageIndexKey = `${this.fixture.collection}:age:${md5(document.age.toString())}`;
            expect(await this.client.exists(ageIndexKey)).to.equal(1);
            expect(await this.client.smembers(ageIndexKey)).to.have.ordered.members(['2', '4', '5']);

            // Check testArr index
            const testArrIndexKey = `${this.fixture.collection}:testArr:${md5(JSON.stringify(document.testArr))}`;
            expect(await this.client.exists(testArrIndexKey)).to.equal(1);
            expect(await this.client.smembers(testArrIndexKey)).to.have.ordered.members(['1', '4', '5']);
            
            // Check testObj index
            const testObjIndexKey = `${this.fixture.collection}:testObj:${md5(JSON.stringify(document.testObj))}`;
            expect(await this.client.exists(testObjIndexKey)).to.equal(1);
            expect(await this.client.smembers(testObjIndexKey)).to.have.ordered.members(['3', '5']);
        });
    });
});

