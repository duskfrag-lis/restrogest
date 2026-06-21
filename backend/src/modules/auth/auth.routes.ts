import { Router } from 'express';
import authController from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import passport from 'passport';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email' ], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }), authController.googleCallback);
router.get('/me', authenticate, authController.me);

export default router;
