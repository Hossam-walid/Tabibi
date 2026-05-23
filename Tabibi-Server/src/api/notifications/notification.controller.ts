import { type Response } from 'express';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import type { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
import { ResponseHandler } from '../../utils/response.util.js';
import * as NotificationService from './notification.service.js';

export const getNotifications = asyncHandler<AuthenticatedRequest>(
    async (req, res: Response) => {
        const userId = req.user.id;
        const notifications = await NotificationService.getUserNotifications(userId);
        const unreadCount = await NotificationService.getUnreadCount(userId);

        ResponseHandler.success(res, { data: notifications, unreadCount });
    }
);

export const markNotificationAsRead = asyncHandler<AuthenticatedRequest>(
    async (req, res: Response) => {
        const id = req.params.id as string;
        const notification = await NotificationService.markAsRead(id, req.user.id);

        ResponseHandler.success(res, { notification });
    }
);

export const markAllNotificationsAsRead = asyncHandler<AuthenticatedRequest>(
    async (req, res: Response) => {
        const result = await NotificationService.markAllAsRead(req.user.id);

        ResponseHandler.success(res, { updatedCount: result.count });
    }
);
