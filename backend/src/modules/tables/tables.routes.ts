import { Router } from "express";
import tablesController from "./tables.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.get('/', tablesController.getAll);
router.get('/:id', tablesController.getById);
router.post('/', authenticate, authorize('administrador'), tablesController.createTable);
router.put('/:id', authenticate, authorize('administrador'), tablesController.updateTable);
router.patch('/:id/status', authenticate, authorize('administrador', 'mesero'), tablesController.updateStatus );
router.delete('/:id', authenticate, authorize('administrador'), tablesController.deleteTable);

export default router;