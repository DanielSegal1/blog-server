import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from './utils';
import { posts as controller } from '../controllers';
import { auth as authMiddleware } from '../middlewares';

const router: Router = Router();

router.get('/', controller.getAllPosts);

router.get('/:id', controller.getPostById);

router.post('/', [
	authMiddleware.verifyToken,
	body(['title', 'content']).isString().notEmpty(),
	validate
], controller.createPost);

router.put('/:id', [
	authMiddleware.verifyToken,
	body(['title', 'content']).isString().optional(),
	validate
], controller.updatePost);

router.delete('/:id', [authMiddleware.verifyToken], controller.deletePost);

export default router;
