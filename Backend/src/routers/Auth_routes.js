import { Router } from 'express';
import passport from "passport";
import  googleCallback  from '../controllers/Auth_controller.js';

const router = Router();

// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account" }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleCallback
);

export default router



