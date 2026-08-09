export interface DeliveryOrderSummary {

    id: string
    order_id: string
    status: string
    address: string
    total: number
    payment_method: string
    created_at: string
}

export interface DeliveryOrderItem {

    id: string
    item_name: string
    quantity: number
    unit_price: number
    notes: string | null
}

export interface DeliveryOrderDetail extends DeliveryOrderSummary {

    items: DeliveryOrderItem[]
}