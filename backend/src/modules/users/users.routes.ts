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
router.post('/me/deletion-request', authenticate, usersController.createDeletionRequest);
router.get('/me/deletion-request', authenticate, usersController.getMyDeletionRequest);
router.get('/deletion-requests', authenticate, authorize('administrador'), usersController.listDeletionRequest);
router.patch('/deletion-requests/:id', authenticate, authorize('administrador'), usersController.resolveDeletionRequest);

export default router;