import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { Chat } from '../models';

const verifyParticipant = async (req: AuthenticatedRequest, res: Response, next) => {
	const {userId} = req;
	const {id: chatId} = req.params;

	try {
		const chat = await Chat.findById(chatId);
		const isParticipant = chat.participants.some(id => id.toString() === userId);

		if (!isParticipant) {
			return res.status(400).send('You are not a participant of this chat');
		}

		next();
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
};

const verifyAdmin = async (req: AuthenticatedRequest, res: Response, next) => {
	const {userId} = req;
	const {id: chatId} = req.params;

	try {
		const chat = await Chat.findById(chatId);
		const isAdmin = chat.admin.toString() === userId;

		if (!isAdmin) {
			return res.status(400).send('This action is for admin only');
		}

		next();
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
};

export default {
	verifyParticipant,
	verifyAdmin
};
