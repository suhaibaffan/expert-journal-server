import Koa from 'koa';
import parser from 'koa-bodyparser';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import chalk from 'chalk';
import './db/init';
import { PORT } from './env';
import { authenticateUser } from './routes/user';

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

    router.get( '/health', ( ctx ) => {
        ctx.body = 'Server is up.'
    });

    // public apis

    router.post( '/user/login', authenticateUser );

    // private apis

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