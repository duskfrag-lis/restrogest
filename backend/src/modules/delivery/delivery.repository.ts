import pool from '../../config/db';

const deliveryRepository = {

    async findAll(status?: string) {

        const query = status ?

        `SELECT do2.*,
            u1.first_name as client_first_name, u1.last_name as client_last_name,
            u2.first_name as deliverer_first_name, u2.last_name as deliverer_last_name,
            o.total
        FROM delivery_orders do2
        JOIN orders o ON o.id = do2.order_id
        JOIN users u1 ON u1.id = do2.client_id
        LEFT JOIN users u2 ON u2.id = do2.deliverer_id
        WHERE do2.status = $1
        ORDER BY do2.created_at DESC`

        : `SELECT do2.*.
            u1.first_name as client_first_name, u1.last_name as client_last_name,
            u2.first_name as deliverer_first_name, u2.last_name as deliverer_last_name,
            o.toral
        FROM delivery_orders do2
        JOIN orders o ON o.id = do2.order_id
        JOIN users u1 ON u1.id = do2.client_id
        LEFT JOIN users u2 ON u2.id = do2.delivery_id
        ORDER BY do2.created_at DESC`;

        const { rows } = status ? await pool.query(query, [status]) : await pool.query(query);

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

            `SELECT do2.*,
                u1.first_name as client_first_name, u1.last_name as client_last_name,
                u2.first_name as deliverer_first_name, u2.last_name as deliverer_last_name,
                o.total
            FROM delivery_orders do2
            JOIN orders o ON o.id = do2.order_id
            JOIN users u1 ON u1.id = do2.client_id
            LEFT JOIN users u2 ON u2.id = do2.deliverer_id
            WHERE do2.id = $1`,

            [id]
        );

        return rows[0] || null;
    },

    async findByCliientId(clientId: string) {

        const { rows } = await pool.query(

            `SELECT do2.*, o.total
            FROM delivery_orders do2
            JOIN orders o ON o.id = do2.order_id
            WHERE do2.client_id = $1
            ORDER BY do2.created_at DESC`,

            [clientId]
        );

        return rows;
    },

    async create(data: {

        order_id: string;
        client_id: string;
        address: string;
        phone: string;
        payment_method: string;
        client_lat: number;
        client_lng: number;

    }) {

        const { rows } = await pool.query(

            `INSERT INTO delivery_orders (order_id, client_id, address, phone, payment_method,
                client_lat, client_lng) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,

            [data.order_id, data.client_id, data.address, data.phone, data.payment_method, 
                data.client_lat, data.client_lng
            ]
        );

        return rows[0];
    },

    async updateStatus(id: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE delivery_orders SET status = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *`,

            [status, id]
        );

        return rows[0] || null;
    },

    async assignDeliverer(id: string, delivererId: string) {

        const { rows } = await pool.query(

            `UPDATE delivery_orders SET deliverer_id = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *`,

            [delivererId, id]
        );

        return rows[0] || null;
    },

    async getConverageZones() {

        const { rows } = await pool.query(

            `SELECT coverage_zones FROM restaurant_info LIMIT 1`
        );

        return rows[0]?.converage_zones || null;
    },

    async updateCoverageZones(zones: object) {

        await pool.query(

            `UPDATE restaurant_info SET converage_zones = $1, updated_at = NOW()`,
            [JSON.stringify(zones)]
        );
    },
};

export default deliveryRepository;