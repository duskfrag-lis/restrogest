import { Router } from "express";
import deliveryController from "./delivery.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.get('/coverage', deliveryController.getCoverageZones);
router.put('/coverage', authenticate, authorize('administrador'), deliveryController.updateCoverageZones);

router.get('/', authenticate, authorize('administrador'), deliveryController.getAll);
router.get('/my', authenticate, authorize('cliente'), deliveryController.getMyDeliveries);
router.get('/:id', authenticate, authorize('cliente', 'domiciliario', 'administrador'), deliveryController.getById);
router.post('/', authenticate, authorize('cliente'), deliveryController.create);
router.patch('/:id/status', authenticate, authorize('domiciliario', 'administrador'), deliveryController.updateStatus);
router.patch('/:id/assign', authenticate, authorize('administrador'), deliveryController.assignDeliverer);

export default router;