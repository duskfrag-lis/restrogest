import { Router } from 'express';
import menuController from './menu.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware'
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

router.get('/categories', menuController.getAllCategories);
router.get('/categories/:id', menuController.getCategoryById);
router.get('/categories/:id/items', menuController.getItemsByCategory);
router.get('/items', menuController.getAllItems);
router.get('/items/:id', menuController.getItemById);

router.post('/categories', authenticate, authorize('administrador'), menuController.createCategory);
router.put('/categories/:id', authenticate, authorize('administrador'), menuController.updateCategory);
router.patch('/categories/:id/toggle', authenticate, authorize('administrador'), menuController.toggleCategory);

router.post('/items', authenticate, authorize('administrador'), upload.single('image'), menuController.createItem);
router.put('/items/:id', authenticate, authorize('administrador'), upload.single('image'), menuController.updateItem);
router.patch('/items/:id/toggle', authenticate, authorize('administrador'), menuController.toggleItem);

export default router;