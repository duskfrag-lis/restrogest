import { Router } from "express";
import kitchenController from "./kitchen.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.get('/', authenticate, authorize('cocinero', 'jefe_cocina', 'administrador'), kitchenController.getActiveOrders);
router.get('/:id', authenticate, authorize('cocinero', 'jefe_cocina', 'administrador'), kitchenController.getOrderWithItems);
router.patch('/:id/items/:itemId/status', authenticate, authorize('cocinero', 'jefe_cocina', 'administrador'), kitchenController.updateItemStatus);
router.patch('/:id/ready', authenticate, authorize('cocinero', 'jefe_cocina', 'administrador'), kitchenController.markOrderReady);

export default router;