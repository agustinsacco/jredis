import * as Redis from 'redis';
import {RedisClient} from 'redis';

export class RedisUtil {
    private client: RedisClient;
    constructor() {
        this.client = Redis.createClient(
            6379,
            'localhost'
        );
    }
    public get(key: string) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    }
    public smembers(key: string) {
        return new Promise((resolve, reject) => {
            this.client.smembers(key, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    }
    public exists(key: string) {
        return new Promise((resolve, reject) => {
            this.client.exists(key, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    }
    public async flushall() {
        return await this.client.flushall();
    }
}