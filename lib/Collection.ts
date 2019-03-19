import * as md5 from 'md5';
import * as Redis from 'redis';
import {RedisClient, Multi} from 'redis';
import {CallStack} from './CallStack';


export class Collection {
    private client: RedisClient;

    constructor() {
        this.client = Redis.createClient(
            6379,
            'localhost'
        );
    }

    public getLastId(collection: string): Promise<number> {
        return new Promise((resolve: Function, reject: Function) => {
            // Get collection 'last'
            return this.client.get(`${collection}:last`, (err: Error, id: any) => {
                if(err) {
                    return reject(err);
                }
                if(id) {
                    return resolve(+id);
                }
                return resolve(id);
            });
        });
    }

    public async getNextId(collection: string): Promise<number> {
        const lastId: number = await this.getLastId(collection);
        if(!lastId) {
            return Promise.resolve(1);
        }
        return Promise.resolve(lastId + 1);
    }

    public async insert(collection: string, document: any): Promise<Object> {
        let multi = this.client.multi();
        // Get last inserted document id in this collection and calculate next
        const id: number = await this.getNextId(collection);
        return new Promise((resolve, reject) => {
            // Set next id
            multi.set(`${collection}:last`, id.toString());
             // Insert collection document to multi queue
            multi = this.indexDocument(collection, document, id, multi);
            // Insert collection document indexes to multi queue
            multi = this.insertDocument(collection, document, id, multi);
            // Execute all commands
            return multi.exec((err: Error, replies: Object) => {
                if(err) {
                    return reject(err);
                }
                return resolve(replies);
            });
        });
    }

    private insertDocument(collection: string, document: any, id: number, multi: Multi): Multi {
        multi.set(`${collection}:${id}`, JSON.stringify(document));
        return multi;
    }

    private async insertLastId(collection: string, nextId: number, multi: Multi): Promise<Multi> {
        multi.set(`${collection}:last`, nextId.toString());
        return Promise.resolve(multi);
    }

    private indexDocument(collection: string, document: any, id: number, multi: Multi): Multi {
        const docKeys = Object.keys(document);
        for(let x=0; x<docKeys.length; x++) {
            const docKey: string = docKeys[x];
            const docVal: any = document[docKey];
            let docValHash: string = '';
            if(typeof docVal === 'string' || typeof docVal === 'number') {
                docValHash = md5(docVal.toString());
            } else {
                docValHash = md5(JSON.stringify(docVal));
            }
            multi.sadd(`${collection}:${docKey}:${docValHash}`, id.toString());
        }
        return multi;
    }
}