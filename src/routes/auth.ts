import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from './utils';
import { auth as controller } from '../controllers';

const router: Router = Router();

router.post('/login', [
	body(['username', 'password']).isString(),
	validate
],  controller.login);

router.post('/signup', [
	body('username').isString().isLength({
		min: 5
	}),
	body('email').isEmail(),
	body('password').isStrongPassword(),
	validate
], controller.signup);

export default router;
