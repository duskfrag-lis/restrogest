import { apiClient } from "../../../shared/http/ApiClient"
import type { MenuCategory, MenuItem } from "../types/menu.types"

export const menuApi = {

    getCategories(onlyActive = true): Promise<{ categories: MenuCategory[] }> {

        return apiClient.request(`/menu/categories?onlyActive=${onlyActive}`)
    },

    getItems(onlyActive = true): Promise<{ items: MenuItem[] }> {

        return apiClient.request(`/menu/items?onlyActive=${onlyActive}`)
    },
}