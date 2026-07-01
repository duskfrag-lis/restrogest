import reservationsRepository from './reservations.repository';
import tablesRepository from '../tables/tables.repository';
import emailService from '../../config/email';

const reservationsService = {

    async getAllReservations() {
        return await reservationsRepository.findAll();
    },

    async getTodayReservations() {
        return await reservationsRepository.findToday();
    },

    async getReservationById(id: string) {

        const reservation = await reservationsRepository.findById(id);

        if (!reservation) throw { status: 404, message: 'Reserva no encontrada' };

        return reservation;
    },

    async getMyReservations(clientId: string) {
        return await reservationsRepository.findByClientId(clientId);
    },

    async getAvailableTables(reservedAt: string, partySize: number) {

        if (!reservedAt || !partySize) {
            throw { status: 400, message: 'Fecha y número de personas son obligatorios' };
        }

        const reservationDate = new Date(reservedAt);

        if (isNaN(reservationDate.getTime())) {
            throw { status: 400, message: 'Fecha inválida' };
        }

        const now = new Date();
        const diffHours = (reservationDate.getTime() - now.getTime()) / 1000 / 60 / 60;

        if (diffHours < 2) {
            throw { status: 400, message: 'Las reservas deben hacerse con mínimo 2 horas de anticipación' };
        }

        return await reservationsRepository.findAvailableTables(reservationDate, partySize);
    },

    async createReservation(data: {

        user_id: string;
        user_email: string;
        user_name: string;
        table_id: string;
        reserved_at: string;
        party_size: number;
        notes?: string;

    }) {

        const reservationDate = new Date(data.reserved_at);

        if (isNaN(reservationDate.getTime())) {
            throw { status: 400, message: 'Fecha inválida' };
        }

        const now = new Date();
        const diffHours = (reservationDate.getTime() - now.getTime()) / 1000 / 60 / 60;

        if (diffHours < 2) {
            throw { status: 400, message: 'Las reservas deben hacerse con mínimo 2 horas de anticipación' };
        }

        if (data.party_size < 1) {
            throw { status: 400, message: 'El número de personas debe ser mayor a 0' };
        }

        const table = await tablesRepository.findById(data.table_id);

        if (!table) throw { status: 404, message: 'Mesa no encontrada' };

        if (table.capacity < data.party_size) {
            throw { status: 400, message: `La mesa seleccionada tiene capacidad para ${table.capacity} personas` };
        }

        const availableTables = await reservationsRepository.findAvailableTables(reservationDate, data.party_size);
        const isAvailable = availableTables.some(t => t.id === data.table_id);

        if (!isAvailable) {
            throw { status: 400, message: 'La mesa seleccionada no está disponible en ese horario' };
        }

        const reservation = await reservationsRepository.create({

            user_id: data.user_id,
            table_id: data.table_id,
            reserved_at: reservationDate,
            party_size: data.party_size,
            notes: data.notes,

        });

        const dateObj = new Date(reservation.reserved_at);

        await emailService.sendReservationConfirmation(

            data.user_email,
            data.user_name,
            {
                date: dateObj.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: dateObj.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
                party_size: data.party_size,
                table_number: table.number,
            }
        );

        return reservation;
    },

    async cancelReservation(id: string, userId: string, userRole: string) {

        const reservation = await reservationsRepository.findById(id);

        if (!reservation) throw { status: 404, message: 'Reserva no encontrada' };

        if (reservation.status === 'cancelada') {
            throw { status: 400, message: 'Esta reserva ya está cancelada' };
        }

        if (userRole === 'administrador') {
            return await reservationsRepository.updateStatus(id, 'cancelada');
        }

        if (reservation.user_id !== userId) {
            throw { status: 403, message: 'No tienes permiso para cancelar esta reserva' };
        }

        const now = new Date();
        const reservedAt = new Date(reservation.reserved_at);
        const diffHours = (reservedAt.getTime() - now.getTime()) / 1000 / 60 / 60;

        if (diffHours < 1) {
            throw { status: 400, message: 'No puedes cancelar una reserva con menos de 1 hora de anticipación' };
        }

        return await reservationsRepository.updateStatus(id, 'cancelada');
    },

    async markNoShow(id: string) {

        const reservation = await reservationsRepository.findById(id);

        if (!reservation) throw { status: 404, message: 'Reserva no encontrada' };

        if (reservation.status !== 'confirmada') {
            throw { status: 400, message: 'Solo se pueden marcar como no presentado las reservas confirmadas' };
        }

        const now = new Date();
        const reservedAt = new Date(reservation.reserved_at);
        const diffMinutes = (now.getTime() - reservedAt.getTime()) / 1000 / 60;

        if (diffMinutes < 15) {
            throw { status: 400, message: 'Solo puedes marcar como no presentado después de 15 minutos de la hora reservada' };
        }

        await reservationsRepository.updateStatus(id, 'no_presentado');
        
        await tablesRepository.updateStatus(reservation.table_id, 'disponible');

        return { message: 'Reserva marcada como no presentado y mesa liberada' };
    },
};

export default reservationsService;