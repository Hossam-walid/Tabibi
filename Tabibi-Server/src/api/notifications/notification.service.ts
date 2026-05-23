import prisma from '../../config/prisma.config.js';
import { NotFoundError } from '../../errors/index.js';
import logger from '../../utils/logger.util.js';
import { getIo } from '../../utils/socket.util.js';

export type NotificationType =
    | 'APPOINTMENT_CREATED'
    | 'APPOINTMENT_STATUS_CHANGED'
    | 'PAYMENT_PROOF_SUBMITTED'
    | 'PAYMENT_VERIFIED';

type CreateNotificationInput = {
    userId: string;
    title: string;
    message: string;
    type: NotificationType | string;
};

export const createNotification = async ({ userId, title, message, type }: CreateNotificationInput) => {
    const notification = await prisma.notification.create({
        data: { userId, title, message, type },
    });

    try {
        getIo().to(userId).emit('notification', notification);
    } catch (error) {
        logger.debug({ error, userId }, 'Socket notification skipped');
    }

    return notification;
};

export const getUserNotifications = async (userId: string) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

export const getUnreadCount = async (userId: string) => {
    return prisma.notification.count({
        where: { userId, isRead: false },
    });
};

export const markAsRead = async (notificationId: string, userId: string) => {
    const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId },
    });

    if (!notification) {
        throw new NotFoundError('Notification not found');
    }

    return prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
    });
};

export const markAllAsRead = async (userId: string) => {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });
};

export const notifyAppointmentCreated = async (appointmentId: string) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: { select: { userId: true, firstName: true, lastName: true } },
            doctor: { select: { userId: true, firstName: true, lastName: true } },
        },
    });

    if (!appointment) return;

    const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName || ''}`.trim();
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim();
    const appointmentDate = appointment.appointmentDate.toLocaleDateString();

    await Promise.all([
        createNotification({
            userId: appointment.patient.userId,
            title: 'Appointment requested',
            message: `Your appointment with ${doctorName} on ${appointmentDate} at ${appointment.startTime} is pending confirmation.`,
            type: 'APPOINTMENT_CREATED',
        }),
        createNotification({
            userId: appointment.doctor.userId,
            title: 'New appointment request',
            message: `${patientName} requested an appointment on ${appointmentDate} at ${appointment.startTime}.`,
            type: 'APPOINTMENT_CREATED',
        }),
    ]);
};

export const notifyAppointmentStatusChanged = async (appointmentId: string, status: string) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: { select: { userId: true, firstName: true, lastName: true } },
            doctor: { select: { userId: true, firstName: true, lastName: true } },
        },
    });

    if (!appointment) return;

    const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName || ''}`.trim();
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim();
    const appointmentDate = appointment.appointmentDate.toLocaleDateString();
    const normalizedStatus = status.toLowerCase().replace('_', ' ');

    await Promise.all([
        createNotification({
            userId: appointment.patient.userId,
            title: 'Appointment updated',
            message: `Your appointment with ${doctorName} on ${appointmentDate} is now ${normalizedStatus}.`,
            type: 'APPOINTMENT_STATUS_CHANGED',
        }),
        createNotification({
            userId: appointment.doctor.userId,
            title: 'Appointment updated',
            message: `Your appointment with ${patientName} on ${appointmentDate} is now ${normalizedStatus}.`,
            type: 'APPOINTMENT_STATUS_CHANGED',
        }),
    ]);
};

export const notifyPaymentProofSubmitted = async (appointmentId: string) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: { select: { firstName: true, lastName: true } },
            doctor: { select: { userId: true } },
        },
    });

    if (!appointment) return;

    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim();

    await createNotification({
        userId: appointment.doctor.userId,
        title: 'Payment proof submitted',
        message: `${patientName} submitted a payment proof for review.`,
        type: 'PAYMENT_PROOF_SUBMITTED',
    });
};
