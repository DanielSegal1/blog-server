import { model, Model, Schema } from 'mongoose';
import { IPost } from './types';

const PostSchema: Schema<IPost> = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Post: Model<IPost> = model('Post', PostSchema);

export default Post;
