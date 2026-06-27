import { Router } from 'express' ;
import profileController from './profile.controller';
import { upload } from '../../middlewares/upload.middleware';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, upload.single('image'), profileController.updateProfile);
router.patch('/change-password', authenticate, profileController.changePassword);
router.delete('/', authenticate, profileController.deleteAccount);

export default router;