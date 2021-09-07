import { Router } from 'express';
import { likes as controller } from '../controllers';
import { auth as authMiddleware } from '../middlewares';

const router: Router = Router();

router.post('/like/:postId', [authMiddleware.verifyToken], controller.addLike);

router.post('/unlike/:postId', [authMiddleware.verifyToken], controller.removeLike);

export default router;
