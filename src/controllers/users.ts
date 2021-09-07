import { Request, Response } from 'express';
import { User } from '../models';

const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find({}).select('-password');
		return res.send(users);
	}
	catch (err) {
		return res.status(500).send({ error: err });
	}
};

const getUserById = async (req: Request, res: Response) => {
	const {id} = req.params;

	try {
		const user = await User.findById(id).select('-password');
		return res.send(user);
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
};

export default {
	getAllUsers,
	getUserById
};
