/**
 * HTTP client for Yoyo API
 */

import type { ApiClientConfig, ApiErrorResponse } from './types.js';

export class ApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: ApiClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  }

  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }

    return this.request<T>('GET', url);
  }

  /**
   * Internal request method
   */
  private async request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': '@yoyo-bot/mcp',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: {
          code: 'SERVER_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      })) as ApiErrorResponse;

      throw new ApiError(
        errorData.error.code,
        errorData.error.message,
        response.status,
        errorData.error.retryAfter
      );
    }

    return response.json() as Promise<T>;
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly retryAfter?: number;

  constructor(code: string, message: string, statusCode: number, retryAfter?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;
  }

  /**
   * Format error for MCP response
   */
  toMcpError(): { error: { code: string; message: string; retryAfter?: number } } {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.retryAfter ? { retryAfter: this.retryAfter } : {}),
      },
    };
  }
}
