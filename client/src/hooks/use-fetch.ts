import { useState, useEffect } from 'react';
import { httpClient } from '../lib/http/http-client';

interface UseFetchResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await httpClient.get<T>(url);
            setData(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [url]);

    return { data, isLoading, error, refetch: fetchData };
}
