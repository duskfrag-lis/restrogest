import { Router } from 'express';
import usersController from './users.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/activate', usersController.activateEmployee);

router.get('/', authenticate, authorize('administrador'), usersController.getAll);
router.get('/:id', authenticate, authorize('administrador'), usersController.getById);
router.post('/employees', authenticate, authorize('administrador'), usersController.createEmployee);
router.patch('/:id/role', authenticate, authorize('administrador'), usersController.changeRole);
router.patch('/:id/status', authenticate, authorize('administrador'), usersController.setActiveStatus);

export default router;