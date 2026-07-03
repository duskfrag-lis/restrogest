import { Router } from 'express';
import reviewsController from './reviews.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/public', reviewsController.getPublicReviews);
router.use(authenticate);

router.get('/my', reviewsController.getMyReviews);
router.get('/', authorize('administrador'), reviewsController.getAllReviews);
router.post('/', authorize('cliente'), reviewsController.create);
router.patch('/:id/visibility', authorize('administrador'), reviewsController.setVisibility);

export default router;