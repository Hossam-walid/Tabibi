import { type Response } from 'express';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import { ResponseHandler } from '../../utils/response.util.js';
import * as ChatService from './chat.service.js';
import type { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export const getMessages = asyncHandler<AuthenticatedRequest>(
    async (req, res: Response) => {
        const { appointmentId } = req.params;
        const userId = req.user.id;

        const messages = await ChatService.getAppointmentMessages(appointmentId, userId);
        ResponseHandler.success(res, { data: messages });
    }
);
