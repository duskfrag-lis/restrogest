import { Router } from 'express';
import reservationsController from './reservations.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/available', reservationsController.getAvailableTables);
router.get('/today', authenticate, authorize('mesero', 'administrador'), reservationsController.getToday);
router.get('/my', authenticate, authorize('cliente'), reservationsController.getMyReservations);
router.get('/', authenticate, authorize('administrador'), reservationsController.getAll);
router.get('/:id', authenticate, authorize('cliente', 'mesero', 'administrador'), reservationsController.getById);
router.post('/', authenticate, authorize('cliente'), reservationsController.create);
router.patch('/:id/cancel', authenticate, authorize('cliente', 'administrador'), reservationsController.cancel);
router.patch('/:id/no-show', authenticate, authorize('mesero', 'administrador'), reservationsController.markNoShow);

export default router;