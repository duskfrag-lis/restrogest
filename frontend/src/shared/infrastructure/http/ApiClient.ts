export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
}

interface ErrorResponse {
  message?: string
}

export class ApiClient {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  async request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const payload = await this.readJson<TResponse | ErrorResponse>(response)

    if (!response.ok) {
      const message =
        this.isErrorResponse(payload) && payload.message
          ? payload.message
          : 'No fue posible completar la solicitud'

      throw new ApiError(response.status, message)
    }

    return payload as TResponse
  }

  private async readJson<TResponse>(response: Response): Promise<TResponse> {
    const text = await response.text()

    if (!text) {
      return {} as TResponse
    }

    return JSON.parse(text) as TResponse
  }

  private isErrorResponse(payload: unknown): payload is ErrorResponse {
    return typeof payload === 'object' && payload !== null && 'message' in payload
  }
}
