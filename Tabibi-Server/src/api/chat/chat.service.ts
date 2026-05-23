import prisma from '../../config/prisma.config.js';
import { NotFoundError } from '../../utils/response.util.js';

export const getAppointmentMessages = async (appointmentId: string, userId: string) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: true,
            doctor: true
        }
    });

    if (!appointment) {
        throw new NotFoundError('Appointment not found');
    }

    // Verify the user is either the doctor or the patient for this appointment
    if (appointment.patient.userId !== userId && appointment.doctor.userId !== userId) {
        throw new Error('Unauthorized to view this chat');
    }

    return prisma.message.findMany({
        where: { appointmentId },
        orderBy: { createdAt: 'asc' },
    });
};

export const saveMessage = async (appointmentId: string, senderId: string, content: string) => {
    const message = await prisma.message.create({
        data: {
            appointmentId,
            senderId,
            content
        }
    });
    return message;
};
