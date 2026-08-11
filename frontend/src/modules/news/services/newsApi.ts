import { apiClient } from "../../../shared/http/ApiClient"
import type { NewsSummary } from "../types/news.types"

export const newsApi = {

    getPublicList(): Promise<{ news: NewsSummary[] }> {

        return apiClient.get('/news/public')
    },

    getPublicById(id: string): Promise<{ news: NewsSummary }> {

        return apiClient.get(`/news/public/${id}`)
    },
}