import { model, Model, Schema } from 'mongoose';
import { IUser } from './types';

const UserSchema: Schema<IUser> = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	followers: [{ type: String }],
	following: [{ type: String }],
	posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
	likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
	chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
}, { timestamps: true });

const User: Model<IUser> = model('User', UserSchema);

export default User;
