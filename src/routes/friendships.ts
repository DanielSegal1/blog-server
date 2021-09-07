import { Router } from 'express';
import { friendships as controller } from '../controllers';
import { auth as authMiddleware } from '../middlewares';

const router: Router = Router();

router.post('/follow/:id', [authMiddleware.verifyToken], controller.follow);

router.post('/unfollow/:id', [authMiddleware.verifyToken], controller.unfollow);

export default router;
