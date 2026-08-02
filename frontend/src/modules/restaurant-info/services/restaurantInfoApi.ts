import { apiClient } from "../../../shared/http/ApiClient";
import type { RestaurantInfo } from "../types/restaurantInfo.types";

export const restaurantInfoApi = {

    getPublicInfo(): Promise<{ info: RestaurantInfo }> {

        return apiClient.request('/restaurant-info/public')
    },
}