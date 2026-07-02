import { Router } from "express";
import inventoryController from "./inventory.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.get('/low-stock', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.findLowStock);
router.get('/expiring-soon', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.findExpiringSoon);
router.get('/expired', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.findExpired);
router.get('/alerts', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.getAlerts);

router.get('/movements', authenticate, authorize('administrador'), inventoryController.getAllMovements);

router.get('/', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.findAll);
router.post('/', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.create);

router.get('/:id', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.findById);
router.put('/:id', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.update);
router.patch('/:id/quantity', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.updateQuantity);

router.get('/:id/movements', authenticate, authorize('administrador', 'jefe_cocina'), inventoryController.getItemMovements);

export default router;