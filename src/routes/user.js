import { generateJWT } from '../jwt';
import { User } from '../db/User.model';

export async function authenticateUser ( ctx ) {
    const { id, name } = ctx.request.body;
    if ( !id || !name ) {
        throw new Error( 'ID and Name is required' );
    }

    const user = await User.findOne({ id });

    if ( !user ) {
        throw new Error( 'User not found' );
    }

    if ( user.name !== name ) {
        throw new Error( 'Name not found' );
    }

    if ( user ) {
        const token = await generateJWT({ id, name, profile: user.profile }, { expiresIn: '1d' });
        ctx.type = 'application/json';
        ctx.body = JSON.stringify( token );
    }
}
