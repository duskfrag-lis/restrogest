import deliveryRepository from "./delivery.repository";
import ordersRepository from "../orders/orders.repository";
import pool from "../../config/db";

const VALID_STATUSES = ['recibido', 'en_preparacion', 'en_camino', 'entregado'];

//Formula de haversine parra calcular distancia en km entre dos coordenadas
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {

    const R = 6371 //radio de la tierra en km

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const C = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * C;
};

const deliveryService = {

    async getAllDeliveries(status?: string) {

        return await deliveryRepository.findAll(status);
    },

    async getDeliveryById(id: string) {

        const delivery = await deliveryRepository.findById(id);

        if (!delivery) throw { status: 404, message: 'Pedido a domicilio no encontrado' };

        const items = await ordersRepository.findItemsByOrderId(delivery.order_id);

        return { ...delivery, items };
    },

    async getMyDeliveries(clientId: string) {

        return await deliveryRepository.findByClientId(clientId);
    },

    async validateConverage(lat: number, lng: number) {

        const zones = await deliveryRepository.getCoverageZones();

        if (!zones) {
            throw { status: 400, message: 'El restaurante no tiene zonas de cobertura configuradas' };
        }

        if (zones.type === 'radius') {

            const distance = haversineDistance(zones.center_lat, zones.center_lng, lat, lng);

            if (distance > zones.radius_km) {
                throw { status: 400, message: `Tu ibicación está fuera de la zona de cobertura. La distancia máxima es ${zones.radius_km} km.`};
            }
        }

        return true;
    },

    async createDeliveryOrder(data: {

        client_id: string;
        items: { menu_item_id: string; quantity: number, notes?: string}[];
        address: string; 
        phone: string;
        payment_method: string;
        client_lat: number;
        client_lng: number;

    }) {

        await deliveryService.validateConverage(data.client_lat, data.client_lng);

        const VALID_PAYMENT_METHODS = ['efectivo', 'tarjeta', 'pse', 'contra_entrega'];

        if (!VALID_PAYMENT_METHODS.includes(data.payment_method)) {
            throw { status: 400, message: `Método de pago inválido. Opciones: ${VALID_PAYMENT_METHODS.join(', ')}`};
        }

        const { rows: ordersRows } = await pool.query(

            `INSERT INTO orders (type, status)
            VALUES ('domicilio', 'pendiente') RETURNING *`,

        );

        const order = ordersRows[0];

        for (const item of data.items) {

            const { rows:menuRows } = await pool.query(

                `SELECT * FROM menu_items WHERE id = $1 AND is_active = true`,
                [item.menu_item_id]
            );

            if (!menuRows[0]) throw { status: 404, message: `Ítem ${item.menu_item_id} no encontrado o inactivo` };

            await pool.query(

                `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, notes)
                VALUES ($1, $2, $3, $4, $5)`,

                [order.id, item.menu_item_id, item.quantity, menuRows[0].price, item.notes || null]
            );
        }

        await pool.query(

            `UPDATE orders SET total = (
                SELECT COALESCE(SUM(quantity * unit_price), 0)
                FROM order_items WHERE order_id = $1
            ) WHERE id = $1`,

            [order.id]
        );

        const delivery = await deliveryRepository.create({

            order_id: order.id,
            client_id: data.client_id,
            address: data.address,
            phone: data.phone,
            payment_method: data.payment_method,
            client_lat: data.client_lat,
            client_lng: data.client_lng,

        });

        return delivery;
    },

    async updateStatus(id: string, status: string, userRole: string) {

        const delivery = await deliveryRepository.findById(id);

        if (!delivery) throw { status: 404, message: 'Pedido a domicilio no encontrado' };

        if (!VALID_STATUSES.includes(status)) {
            throw { status: 400, message: `Estado inválido. Los estado válidos son: ${VALID_STATUSES.join(', ')}`};
        }

        const VALID_TRANSITIONS: Record<string, string[]> = {

            'recibido': ['en_preparacion'],
            'en_preparacion': ['en_camino'],
            'en_camino': ['entregado'],
            'entregado': [],
        };

        if (!VALID_TRANSITIONS[delivery.status]?.includes(status)) {
            throw { status: 400, message: `No se puede cambiar el estado de '${delivery.status}' a '${status}'`};
        }

        if (status === 'en_camino' && userRole !== 'administrador' && userRole !== 'domiciliario') {
            throw { status: 403, message: 'Solo el comiciliario o administrador pueden marcar un pedido como en camino'};
        }

        if (status === 'entregado') {

            const canClose = delivery.payment_status === 'aprobado' || delivery.payment_method === 'contra_entrega';

            if (!canClose) {
                throw { status: 400, message: 'No se pueden marcar como entregado: el pago no está confirmado' };
            }
        }

        if (status === 'entregado' && userRole !== 'domiciliario' && userRole !== 'administrador') {
            throw { status: 403, message: 'Solo el domiciliario o administrador pueden marcar un pedido como entregado '};
        }

        return await deliveryRepository.updateStatus(id, status);
    },

    async assignDeliverer(id: string, delivererId: string) {

        const delivery = await deliveryRepository.findById(id);

        if (!delivery) throw { status: 404, message: 'Pedido a domicilio no encontrado'};

        const { rows } = await pool.query(

            `SELECT u.id, r.name as role FROM users u
            JOIN user_roles ur ON ur.user_id = u.id
            JOIN roles r ON r.id = ur.role_id
            WHERE u.id = $1 AND r.name = 'domiciliario' AND u.is_active = true`,

            [delivererId]
        );

        if (!rows[0]) throw { status: 404, message: 'El usuario no existe o no tiene el rol de domiciliario' };

        return await deliveryRepository.assignDeliverer(id, delivererId);
    },

    async getCoverageZones() {

        const zones = await deliveryRepository.getCoverageZones();

        if (!zones) throw { status: 404, message: 'No hay zonas de cobertura configuradas' };

        return zones;
    },

    async updateCoverageZones(data: {

        type: 'radius';
        center_lat: number;
        center_lng: number;
        radius_km: number;

    }) {

        if (!data.type || !data.center_lat || !data.center_lng || !data.radius_km) {
            throw { status: 400, message: 'Faltan datos de configuración de zona de cobertura'};
        }

        if (data.radius_km <= 0) {
            throw { status: 400, message: 'El radio debe ser mayor a 0 km' };
        }

        await deliveryRepository.updateCoverageZones(data);

        return { message: 'Zona de cobertura actualizada correctamente' };
    },
};

export default deliveryService;