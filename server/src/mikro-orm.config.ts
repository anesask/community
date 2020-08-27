import { Post } from './entities/Post';
import { User } from './entities/User';
import { __prod__ } from './constants';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';


console.log("dirname:", __dirname);

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
    dbName: 'community_v1',
    type: 'postgresql',
    user: 'postgres',
    password: 'administrator',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
