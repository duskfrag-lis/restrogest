import { Router } from "express";
import ordersController from "./orders.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware"

const router = Router();

router.get('/', authenticate, authorize('mesero', 'administrador'), ordersController.getAll);
router.get('/:id', authenticate, authorize('mesero', 'administrador'), ordersController.getById);
router.get('/table/:tableId', authenticate, authorize('mesero', 'administrador'), ordersController.getByTable);
router.post('/', authenticate, authorize('mesero', 'administrador'), ordersController.create);
router.post('/:id/items', authenticate, authorize('mesero', 'administrador'), ordersController.addItem);
router.delete('/:id/items/:itemId', authenticate, authorize('mesero', 'administrador'), ordersController.removeItem);
router.patch('/:id/send-to-kitchen', authenticate, authorize('mesero', 'administrador'), ordersController.sendToKitchen);
router.patch('/:id/status', authenticate, authorize('mesero', 'administrador', 'cocinero', 'jefe_cocina'), ordersController.updateStatus);

export default router;
