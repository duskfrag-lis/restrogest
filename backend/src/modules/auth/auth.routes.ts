import { Router } from 'express';
import authController from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authRateLimiter, strictRateLimiter } from '../../middlewares/rateLimit.middleware';
import passport from 'passport';

const router = Router();

router.post('/register', authRateLimiter, authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authRateLimiter, authController.resendVerification);
router.post('/forgot-password', strictRateLimiter, authController.forgotPassword);
router.post('/reset-password', strictRateLimiter, authController.resetPassword);
router.post('/login', authRateLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email' ], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }), authController.googleCallback);
router.get('/me', authenticate, authController.me);

export default router;
