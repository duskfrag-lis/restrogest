export const SOCKET_EVENTS = {

    ORDER_CREATED: 'order:created',
    ORDER_STATUS_CHANGED: 'order:status_changed',
    TABLE_STATUS_CHANGED: 'table:status_changed',
    DELIVERY_ASSIGNED: 'delivery:assigned',
    DELIVERY_STATUS_CHANGED: 'delivery:status_changed',
    RESERVATION_CREATED: 'reservation:created',
    INVENTORY_CREATED: 'inventory:created',
    INVENTORY_ALERT: 'inventory:alert',
    
} as const;