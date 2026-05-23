import { Router } from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from './notification.controller.js';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, markAllNotificationsAsRead);
router.patch('/:id/read', protect, markNotificationAsRead);

export default router;
