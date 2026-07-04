import { Router } from 'express';
import restaurantInfoController from './restaurant_info.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/public', restaurantInfoController.getPublicInfo);

router.use(authenticate);
router.put('/', authorize('administrador'), restaurantInfoController.update);

export default router;