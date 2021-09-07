import { model, Model, Schema } from 'mongoose';
import { IChat } from './types';

const ChatSchema: Schema<IChat> = new Schema({
	name: { type: String, required: true },
	admin: {type: Schema.Types.ObjectId, ref: 'User'},
	participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
	messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
}, { timestamps: true });

const Chat: Model<IChat> = model('Chat', ChatSchema);

export default Chat;
