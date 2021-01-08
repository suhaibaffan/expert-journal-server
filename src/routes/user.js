import { generateJWT, verifyJWT, getBearerToken } from '../jwt';
import { User } from '../db/User.model';
import { Task } from '../db/Task.model';

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
        ctx.body = { token: JSON.stringify( token ), name, profile: user.profile };
    }
}

export async function createTask ( ctx ) {
    const { name } = ctx.request.body;

    if ( !name )
        throw new Error( 'Name required for a new task' );
    
    const bearerToken = getBearerToken( ctx );
    const { token } = await verifyJWT( bearerToken );
    const user = await User.findOne({ id: token.id });

    if ( !user )
        throw new Error( 'User may have deleted his account!' );

    const task = new Task({
        name,
        user: user._id,
        completed: false
    });

    await task.save();

    ctx.status = 201;
}

export async function getAllTasks ( ctx ) {
    const bearerToken = getBearerToken( ctx );
    const { token } = await verifyJWT( bearerToken );
    const user = await User.findOne({ id: token.id });

    if ( !user )
        throw new Error( 'User may have deleted his account!' );

    const tasks = await Task.find({ user: user._id }).lean();

    ctx.status = 200;
    ctx.body = { tasks };
}

export async function updateTask ( ctx ) {
    const { name, completed } = ctx.request.body;
    const { id } = ctx.params;

    try {
        const task = await Task.findByIdAndUpdate( id, {
            ...( name ? { name } : {} ),
            ...( completed === false || completed === true ? { completed } : {} )
        }, { new: true });
        ctx.status = 200;
        ctx.body = { task };
    } catch ( err ) {
        ctx.status = 404;
        ctx.body = 'Task not found!';
    }
}

export async function deleteTask ( ctx ) {
    const { id } = ctx.params;

    try{
        await Task.findByIdAndDelete( id );
        ctx.status = 200;
        ctx.body = 'Task deleted.'
    } catch ( err ) {
        ctx.status = 404;
        ctx.body = 'Task not found!';
    }
}

export async function dashboard ( ctx ) {
    const bearerToken = getBearerToken( ctx );
    const { token } = await verifyJWT( bearerToken );
    const user = await User.findOne({ id: token.id });

    if ( !user )
        throw new Error( 'User may have deleted his account!' );

    const tasks = await Task.find({ user: user._id }).lean();
    const tasksCompleted = tasks.filter( task => task.completed ).length;
    const totalTasks = tasks.length;
    const latestTasks = await Task.find({ created_at: { $gt: new Date().getTime() - ( 5 * 60 * 1000 ) } });

    ctx.status = 200;
    ctx.body = {
        tasksCompleted,
        totalTasks,
        latestTasks
    }
}
