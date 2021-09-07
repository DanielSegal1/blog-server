import { Document, Types } from 'mongoose';

export interface IUser extends Document {
	username: string,
	email: string,
	password: string,
	followers: Array<string>,
	following: Array<string>,
	posts: Array<Types.ObjectId>,
	likes: Array<Types.ObjectId>,
	chats: Array<Types.ObjectId>
}

export interface IPost extends Document {
	title: string,
	content: string,
	userId: string,
	likes: Array<Types.ObjectId>
}

export interface IMessage extends Document {
	sender: Types.ObjectId,
	content: string
}

export interface IChat extends Document {
	name: string,
	admin: Types.ObjectId,
	participants: Array<Types.ObjectId>,
	messages: Array<Types.ObjectId>
}