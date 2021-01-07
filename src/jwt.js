import jwt from 'jsonwebtoken';
import { PRIVATE_KEY, PUBLIC_KEY } from './env';

const algorithm = 'RS512';

export async function generateJWT ( payload, options ) {
    payload = {
        ...payload
    };

    return jwt.sign( payload, PRIVATE_KEY, { algorithm, ...options });
}

export async function verifyJWT ( token ) {
    try {
        const verifiedToken = jwt.verify( token, PUBLIC_KEY, {
            algorithms: [ 'RS512' ]
        });

        return { ok: true, status: 204, token: verifiedToken };
    } catch ( err ) {
        console.error({ err }, `Verify validation failed. ${err.toString()}.` );
        return { ok: false, status: 403 };
    }
}
