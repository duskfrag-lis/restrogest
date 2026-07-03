import { Router } from "express";
import newsController from "./news.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.get('/public', newsController.getPublicNews);
router.get('/public/:id', newsController.getPublicNewsById);

router.use(authenticate);

router.get('/', authorize('administrador'), newsController.getAllNews);
router.post('/', authorize('administrador'), newsController.create);
router.put('/:id', authorize('administrador'), newsController.update);
router.patch('/:id/publish', authorize('administrador'), newsController.publish);
router.patch('/:id/unpublish', authorize('administrador'), newsController.unpublish);

export default router;