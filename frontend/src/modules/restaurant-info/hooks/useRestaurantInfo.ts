import { useEffect, useState } from "react";
import { restaurantInfoApi } from "../services/restaurantInfoApi";
import type { RestaurantInfo } from "../types/restaurantInfo.types";

export function useRestaurantInfo() {

    const [info, setInfo] = useState<RestaurantInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        let isMounted = true

        restaurantInfoApi.getPublicInfo().then((result) => { if (isMounted) setInfo(result.info) })
            .catch(() => { if (isMounted) setInfo(null) })
            .finally(() => { if (isMounted) setIsLoading(false) })

        return () => { isMounted = false }
    }, [])

    return { info, isLoading }
}