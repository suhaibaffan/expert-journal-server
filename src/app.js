import Koa from 'koa';
import parser from 'koa-bodyparser';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import chalk from 'chalk';
import './db/init';
import { PORT } from './env';
import { authenticateUser, createTask, deleteTask, getAllTasks, updateTask } from './routes/user';
import { verifyJWT, getBearerToken } from './jwt';

main();

async function main () {
    await startServer()
    console.log( chalk.green( 'Application started successfully' ) );
}

async function startServer () {
    const app = new Koa();
    app.use( errorHandlerMiddleware() );
    app.use( logger() );
    app.use( parser() );

    const router = new KoaRouter();

    // public apis
    router.get( '/health', ( ctx ) => {
        ctx.body = 'Server is up.'
    });

    router.post( '/user/login', authenticateUser );

    // private apis

    router.get( '/user/dashboard', checkAuthToken, ( ctx ) => {
        ctx.body = "done"
    });

    router.get( '/user/tasks', checkAuthToken, getAllTasks );

    router.post( '/user/tasks', checkAuthToken, createTask );

    router.put( '/user/tasks/:id', checkAuthToken, updateTask );

    router.delete( '/user/tasks/:id', checkAuthToken, deleteTask );

    app.use( router.routes() );
    app.use( router.allowedMethods() );
    app.on( 'error', err => {
        console.log( chalk.bgRedBright( err ) );
    });

    app.listen( PORT );

    console.log( `HTTP server listening on port ${chalk.bold( PORT )}` );
}

function errorHandlerMiddleware () {
    return async ( ctx, next ) => {
        try {
            await next();
        } catch ( err ) {
            ctx.status = err.status || 500;
            ctx.body = err.message || err.toString();
        }
    };
}

async function checkAuthToken ( ctx, next ) {
    const token = getBearerToken( ctx );
    if ( !token ) {
        ctx.status = 401;
        ctx.body = 'Missing authentication.';
        console.warn({ req: ctx.req }, 'Unauthenticated request - missing bearer token' );
        return undefined;
    }

    const { ok: authorized } = await verifyJWT( token );

    if ( !authorized ) {
        ctx.status = 403;
        ctx.body = 'Unauthorized';
        return undefined;
    }

    ctx.authorization = { token };

    return next();
}
