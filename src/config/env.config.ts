import * as env from 'env-var';
import { config } from 'dotenv';

config();

export const NODE_ENV = env.get('NODE_ENV').required().asString();
export const PORT = env.get('PORT').required().asInt();
export const JWT_SECRET = env.get('JWT_SECRET').asString();
export const REDIS_HOST = env.get('REDIS_HOST').asString();
export const REDIS_PORT = env.get('REDIS_PORT').asInt();
export const REDIS_PASSWORD = env.get('REDIS_PASSWORD').asString();
export const DB_URL = env.get('DB_URL').asString();
export const DB_TYPEORM_SYNC = env.get('DB_TYPEORM_SYNC').asBool();
export const DB_MIGRATION = env.get('DB_MIGRATION').asBool();