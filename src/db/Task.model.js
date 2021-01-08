import mongoose, { db } from './init';

const TaskSchema = new mongoose.Schema({
    name: { type: String },
    completed: { type: Boolean },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    created_at: { type: Date, default: Date.now }
});

TaskSchema.pre('save', function (next) {
    if ( '' == this.name ) {
        return next(new Error( 'Cannot be empty' ) );
    }
    next();
});

export const Task = db.model( 'task', TaskSchema );
