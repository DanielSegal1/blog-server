import { model, Model, Schema } from 'mongoose';
import { IMessage } from './types';

const MessageSchema: Schema<IMessage> = new Schema({
	sender: { type: Schema.Types.ObjectId, ref: 'User' },
	content: { type: String, required: true }
}, { timestamps: true });

const Message: Model<IMessage> = model('Message', MessageSchema);

export default Message;
