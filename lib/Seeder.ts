
import {RedisClient, Multi, print} from '../../jredis';
import * as faker from 'faker';

export class Seeder {
    public static seed(client: RedisClient, count: number) {
        let multi: Multi = client.multi();
        // Lets seed the table with 5 products in table 'products'
        for(let x=1; x<=count; x++) {
            const product = {
                id: x,
                code: `123P${x}`,
                name: faker.commerce.productName(),
                price: faker.commerce.price(),
                color: faker.commerce.color(),
                sizes: [
                    {
                        sku: `123P${x}01`,
                        size: Math.floor((Math.random() * 12) + 8),
                        stock: Math.floor((Math.random() * 10) + 1)
                    },
                    {
                        sku: `123P${x}02`,
                        size: Math.floor((Math.random() * 12) + 8),
                        stock: Math.floor((Math.random() * 10) + 1)
                    }
                ]
            }
            client.set(`products:${x}`, JSON.stringify(product), (err: any, res: any) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(res);
                return;
            });
        }
        multi.exec();
    }
}