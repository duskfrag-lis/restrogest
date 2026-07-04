import { Router } from 'express';
import reportsController from './reports.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('administrador'));

router.get('/sales', reportsController.getSalesReport);
router.get('/orders-by-status', reportsController.getOrdersByStatusReport);
router.get('/top-products', reportsController.getTopSellingProductsReport);
router.get('/inventory', reportsController.getInventoryStatusReport);

export default router;