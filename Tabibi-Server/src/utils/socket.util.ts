import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import prisma from '../config/prisma.config.js';

let io: Server;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined room: ${userId}`);
    });

    socket.on('join_appointment', (appointmentId: string) => {
      socket.join(`appointment_${appointmentId}`);
      console.log(`User joined appointment room: appointment_${appointmentId}`);
    });

    socket.on('send_message', async (data: { appointmentId: string, senderId: string, content: string }) => {
      try {
        const message = await prisma.message.create({
          data: {
            appointmentId: data.appointmentId,
            senderId: data.senderId,
            content: data.content,
          }
        });
        socket.to(`appointment_${data.appointmentId}`).emit('receive_message', message);

        // Notify recipient
        const appointment = await prisma.appointment.findUnique({
          where: { id: data.appointmentId },
          include: { patient: true, doctor: true }
        });

        if (appointment) {
          const recipientId = appointment.patient.userId === data.senderId 
            ? appointment.doctor.userId 
            : appointment.patient.userId;

          const senderUser = await prisma.user.findUnique({ where: { id: data.senderId } });
          const senderName = senderUser?.name || 'Someone';

          const notification = await prisma.notification.create({
            data: {
              userId: recipientId,
              title: 'New Message',
              message: `You have a new message from ${senderName}`,
              type: `NEW_MESSAGE|${data.appointmentId}`
            }
          });
          
          io.to(recipientId).emit('notification', notification);
        }
      } catch (error) {
        console.error('Error saving message via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User Disconnected:', socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};