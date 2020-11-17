import { Options } from '@mikro-orm/core';

import {Post} from "./entities/Post";

import {__prod__} from "./constants";
import path from "path";

import * as dotenv from "dotenv";

dotenv.config();

const mikroOrmConfig: Options =  {
    entities: [Post],
    dbName: process.env.POSTGRES_DB,
    type: 'postgresql',
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    debug: __prod__,
    tsNode: __prod__,
    baseDir: __dirname,
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
};

export default mikroOrmConfig;
