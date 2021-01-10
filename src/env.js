import { join } from 'path';
import { readFileSync } from 'fs-extra';

const defaultPrivateKey = readFileSync( join( __dirname, 'keys', 'RS512.key' ) );
const defaultPublicKey = readFileSync( join( __dirname, 'keys', 'RS512.key.pub' ) );
export const {
    NODE_ENV = 'development',
    PORT = 8000,
    MONGO_URI = 'mongodb+srv://dbUser:dbPassword@cluster0.gw8ra.mongodb.net/journal?retryWrites=true&w=majority',
    PRIVATE_KEY = defaultPrivateKey,
    PUBLIC_KEY = defaultPublicKey
} = process.env;
