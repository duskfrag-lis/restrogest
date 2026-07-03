import { Router } from 'express';
import paymentsController from './payments.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/webhook', paymentsController.webhook);

router.use(authenticate);

router.get('/', authorize('administrador'), paymentsController.findAll);
router.post('/', paymentsController.create);
router.get('/order/:orderId', paymentsController.findByOrderId);
router.get('/:id', paymentsController.findById);

router.patch('/:id/confirm', authorize('administrador', 'mesero', 'domiciliario'), paymentsController.confirmManual);
router.patch('/:id/refund', authorize('administrador'), paymentsController.refund);

export default router;