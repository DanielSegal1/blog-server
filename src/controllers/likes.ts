import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { Post, User } from '../models';

const addLike = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {postId} = req.params;

	try {
		const likedPost = await Post.findById(postId);

		const isLikeExisting = likedPost.likes.some(id => id.toString() === userId);

		if (!isLikeExisting) {
			const user = await User.findById(userId);

			likedPost.likes = [...likedPost.likes, user._id];
			user.likes = [...user.likes, likedPost._id];

			await likedPost.save();
			await user.save();
		}

		return res.sendStatus(200);
	}
	catch (err) {
		return res.status(500).send(err);
	}
};

const removeLike = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {postId} = req.params;

	try {
		const likedPost = await Post.findById(postId);

		const isLikeExisting = likedPost.likes.some(id => id.toString() === userId);

		if (isLikeExisting) {
			const user = await User.findById(userId);

			likedPost.likes = likedPost.likes.filter(id => id.toString() !== userId);
			user.likes = user.likes.filter(id => id.toString() !== postId);

			await likedPost.save();
			await user.save();
		}

		return res.sendStatus(200);
	}
	catch (err) {
		return res.status(500).send(err);
	}
};

export default {
	addLike,
	removeLike
};
