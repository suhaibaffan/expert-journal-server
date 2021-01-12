import mongoose, { db } from './init';

const UserSchema = new mongoose.Schema({
    name: { type: String, index: true, unique: true },
    id: { type: String, index: true, unique: true, minlength: 5, maxlength: 10 },
    profile: { type: String }
});

export const User = db.model( 'user', UserSchema );
