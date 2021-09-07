import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { Post, User } from '../models';


const getAllPosts = async (req: Request, res: Response) => {
	try {
		const posts = await Post.find({});
		return res.send(posts);
	}
	catch (err) {
		return res.status(500).send({ error: err });
	}
};

const getPostById = async (req: Request, res: Response) => {
	const {id} = req.params;

	try {
		const post = await Post.findById(id)
		return res.send({post});
	}
	catch (err) {
		return res.status(500).send({error: err});
	}

};

const createPost = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {title, content} = req.body;

	try {
		const user = await User.findById(userId);
		const post = new Post({title, content, userId});

		const savedPost = await post.save();
		user.posts = [...user.posts, savedPost.id];

		await user.save();
		return res.status(201).send({savedPost});
	}
	catch (err) {
		return res.status(500).send(err);
	}
};

const updatePost = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {id: postId} = req.params;
	const {title, content} = req.body;

	try {
		const post = await Post.findById(postId);

		if (post.userId.toString() !== userId) {
			return res.status(400).send({ message: 'forbidden' });
		}

		if (title) {
			post.title = title;
		}

		if (content) {
			post.content = content;
		}

		const savedPost = await post.save();
		return res.status(200).send(savedPost);
	}
	catch (err) {
		return res.status(500).send(err);
	}
};

const deletePost = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {id: postId} = req.params;

	try {
		const post = await Post.findById(postId);

		if (post.userId.toString() !== userId) {
			return res.status(400).send({ message: 'forbidden' });
		}

		const user = await User.findById(userId);

		user.posts = user.posts.filter(id => !id.equals(postId));

		await post.delete();
		await user.save();

		return res.sendStatus(200);
	}
	catch (err) {
		return res.status(500).send(err);
	}
};

export default {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost
};
