const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || '';

type ApiClientOptions = RequestInit & {
    data?: any;
}

export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { data, headers: customHeaders, ...restOptions } = options;

    const url = endpoint.startsWith('http') ? endpoint :`${BASE_URL}${endpoint}`

    const isFormData = data instanceof FormData;

    const headers: HeadersInit = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(customHeaders || {}),
    };

    const config: RequestInit = {
        ...restOptions,
        headers,
        credentials: 'include',
    };

    if (data) {
        config.body = isFormData ? data : JSON.stringify(data);
    }

    try{
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `API Error: ${response.statusText}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    } catch(err) {
        const message = err instanceof Error ? err.message : 'Unknown Error';
        console.error(`[API] Error in ${url}: ${message}`);
        throw new Error(message);
    }
}