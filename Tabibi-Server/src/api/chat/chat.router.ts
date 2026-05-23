import { Router } from 'express';
import { getMessages } from './chat.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/:appointmentId', protect, getMessages);

export default router;
