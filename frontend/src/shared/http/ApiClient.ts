import { API_BASE_URL } from '../../core/config/env';

type RequestOptions = Omit<RequestInit, 'body'> & {

    body?: unknown;
    isFormData?: boolean;
};

export class ApiError extends Error {

    status: number;
    payload: unknown;

    constructor(status: number, message: string, payload: unknown) {

        super(message);
        this.status = status;
        this.payload = payload;
    }
}

class ApiClient {

    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async request<T>(path: string, options: RequestOptions = {}): Promise<T> {

        const { body, isFormData, headers, ...rest } = options;

        const finalHeaders: HeadersInit = isFormData ? { ...headers } : { 'Content-Type': 'application/json', ...headers };

        const response = await fetch(`${this.baseUrl}${path}`, {

            ...rest,
            credentials: 'include',
            cache: 'no-store',
            headers: finalHeaders,
            body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
        });

        const contentType = response.headers.get('content-type') ?? '';

        const payload = contentType.includes('application/json') ? await response.json() : null;

        if (!response.ok) {

            const message = (payload as { message?: string })?.message ?? 'Ocurrió un error inesperado';
            throw new ApiError(response.status, message, payload);
        }

        return payload as T;
    }

    get<T>(path: string, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'GET' });
    }

    post<T>(path: string, body?: unknown, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'POST', body });
    }

    put<T>(path: string, body?: unknown, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'PUT', body });
    }

    patch<T>(path: string, body?: unknown, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'PATCH', body });
    }

    delete<T>(path: string, options?: RequestOptions) {
        return this.request<T>(path, { ...options, method: 'DELETE' });
    }    
}

export const apiClient = new ApiClient(API_BASE_URL);