import { useEffect, useState } from "react"
import { deliveryApi } from "../services/deliveryApi"
import type { DeliveryOrderSummary } from "../types/delivery.types"

export function useMyDeliveries() {

    const [deliveries, setDeliveries] = useState<DeliveryOrderSummary[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        deliveryApi.getMy()
            .then((result) => { if (isMounted) setDeliveries(result.deliveries) })
            .catch(() => { if (isMounted) setDeliveries([]) })
            .finally(() => { if (isMounted) setIsLoading(false) })

        return () => { isMounted = false }

    }, [])

    return { deliveries, isLoading }
}