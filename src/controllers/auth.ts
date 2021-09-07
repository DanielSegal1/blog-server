import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express';
import { User } from '../models';
import { authConfig } from '../config';

const signup = async (req: Request, res: Response) => {
	const {username, email, password} = req.body;

	try {
		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.status(400).send({ message: 'This username is already in use' });
		}

		const user = new User({
			username,
			email,
			password: bcrypt.hashSync(password)
		});

		await user.save();

		return res.send({ message: 'The registration was successful' });
	}
	catch (err) {
		return res.status(500).send(err);
	}
};

const login = async (req: Request, res: Response) => {
	const {username, password} = req.body;

	try {
		const user = await User.findOne({username});

		if (!user) {
			return res.status(404).send({ message: 'User was not found' });
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).send({
				accessToken: null,
				message: 'Invalid password'
			});
		}

		const token = jwt.sign({ id: user.id }, authConfig.secret, {
			expiresIn: '24h'
		})


		res.status(200).send({
			id: user._id,
			username: user.username,
			email: user.email,
			accessToken: token
		});
	}
	catch (err) {
		return res.status(500).send({ error: err });
	}
};

export default {
	signup,
	login
};
