import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { User, Chat, Message } from '../models';

const getAllUsersChats = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;

	try {
		const userWithChats = await User.findById(userId).populate('chats');

		return res.send(userWithChats.chats);
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
};

const getChatById = async (req: AuthenticatedRequest, res: Response) => {
	const {id: chatId} = req.params;

	try {
		const chat = await Chat.findById(chatId);

		return res.send(chat);
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
};

const createChat = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {name, participants} = req.body;

	if (!participants.includes(userId)) {
		participants.push(userId);
	}

	try {
		const chat = new Chat({
			name,
			admin: userId,
			participants
		});

		const savedChat = await chat.save();

		const participantsSavingPromises = participants.map(async (id) => {
			const participant = await User.findById(id);
			participant.chats = [...participant.chats, savedChat.id];
			await participant.save();
		});

		await Promise.allSettled(participantsSavingPromises);

		return res.status(201).send(savedChat);
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
}

const updateChat = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {name, participants} = req.body;
	const {id: chatId} = req.params;

	try {
		const chat = await Chat.findById(chatId);

		if (name) {
			chat.name = name;
		}

		if (participants) {
			if (!participants.includes(userId)) {
				participants.push(userId);
			}

			const participantsToRemove = chat.participants.filter(participantId => !participants.includes(participantId.toString()));
			const participantsToAdd = participants.filter(participantId => !chat.participants.some(id => id.toString() !== participantId));

			const participantsToRemovePromises = participantsToRemove.map(async participantId => {
				const user = await User.findById(participantId);
				user.chats = user.chats.filter(id => id.toString() !== chatId);
				await user.save();
			});

			const participantsToAddPromises = participantsToAdd.map(async participantId => {
				const user = await User.findById(participantId);
				user.chats = [...user.chats, chat._id];
				await user.save();
			});

			await Promise.allSettled([...participantsToRemovePromises, ...participantsToAddPromises]);

			chat.participants = participants;

			await chat.save();
			return res.send(chat);
		}
	}
	catch (err) {
		return res.status(500).send({error: err});
	}
};

const deleteChat = async (req: AuthenticatedRequest, res: Response) => {
	const {id: chatId} = req.params;

	try {
		const chat = await Chat.findById(chatId);
		const {participants} = chat;

		await Promise.allSettled(participants.map(async participantId => {
			try {
				const user = await User.findById(participantId);
				user.chats = user.chats.filter(id => id.toString() !== chatId);
				await user.save();
			}
			catch {
				return;
			}
		}));

		await chat.delete();

		return res.send({message: 'deleted successfully'});
	}
	catch (err) {
		return res.status(500).send({error: err})
	}
};

const leaveChat = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {id: chatId} = req.params;

	try {
		const chat = await Chat.findById(chatId);
		chat.participants = chat.participants.filter(participantId => participantId.toString() !== userId);

		const user = await User.findById(userId);
		user.chats = user.chats.filter(id => id.toString() !== chatId);
		await user.save();

		if (user._id === chat.admin) {
			if (chat.participants.length === 0) {
				await chat.delete();
			}
			else {
				chat.admin = chat.participants[0];
				await chat.save();
			}
		}

		await chat.save();

		return res.send({message: 'left successfully'});
	}
	catch (err) {
		return res.status(500).send({error: err})
	}
};

const getMessages = async (req: AuthenticatedRequest, res: Response) => {
	const {id: chatId} = req.params;

	try {
		const {messages} = await Chat.findById(chatId).populate('messages');

		return res.send({messages});
	}
	catch (err) {
		return res.status(500).send({error: err})
	}
};

const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
	const {userId} = req;
	const {id: chatId} = req.params;
	const {content} = req.body;

	try {
		const message = new Message({
			sender: userId,
			content
		});

		const savedMessage = await message.save();

		const chat = await Chat.findById(chatId);
		chat.messages = [...chat.messages, savedMessage._id];

		await chat.save();
		return res.send(savedMessage);
	}
	catch (err) {
		return res.status(500).send({error: err})
	}
};

export default {
	getAllUsersChats,
	getChatById,
	createChat,
	updateChat,
	deleteChat,
	leaveChat,
	getMessages,
	sendMessage
};
