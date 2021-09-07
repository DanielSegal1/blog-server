import { Router } from 'express';
import { users as controller } from '../controllers';

const router: Router = Router();

router.get('/', controller.getAllUsers);

router.get('/:id', controller.getUserById);

export default router;
