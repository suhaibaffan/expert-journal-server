import { join } from 'path';
import { readFileSync } from 'fs-extra';

const defaultPrivateKey = readFileSync( join( __dirname, 'keys', 'RS512.key' ) );
const defaultPublicKey = readFileSync( join( __dirname, 'keys', 'RS512.key.pub' ) );
export const {
    NODE_ENV = 'development',
    PORT = 8000,
    MONGO_URI,
    PRIVATE_KEY = defaultPrivateKey,
    PUBLIC_KEY = defaultPublicKey
} = process.env;
