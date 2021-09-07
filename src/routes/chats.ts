import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from './utils';
import { chats as controller } from '../controllers';
import { auth as authMiddleware, chat as chatMiddleware } from '../middlewares';

const router: Router = Router();

router.get('/', [authMiddleware.verifyToken], controller.getAllUsersChats);

router.get('/:id', [authMiddleware.verifyToken, chatMiddleware.verifyParticipant], controller.getChatById);

router.post('/', [
	authMiddleware.verifyToken,
	body('name').isString().notEmpty(),
	body('participants').isArray(),
	validate
], controller.createChat);

router.put('/:id', [
	authMiddleware.verifyToken,
	chatMiddleware.verifyAdmin,
	body('name').isString().optional(),
	body('participants').isArray().optional(),
	validate
], controller.updateChat);

router.delete('/:id', [authMiddleware.verifyToken, chatMiddleware.verifyAdmin], controller.deleteChat);

router.get('/:id/leave', [authMiddleware.verifyToken, chatMiddleware.verifyParticipant], controller.leaveChat);

router.get('/:id/messages', [authMiddleware.verifyToken, chatMiddleware.verifyParticipant], controller.getMessages);

router.post('/:id/messages', [
	authMiddleware.verifyToken,
	chatMiddleware.verifyParticipant,
	body('content').isString().notEmpty(),
	validate
], controller.sendMessage);

export default router;
