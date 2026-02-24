"use client";
import { useState, useCallback } from "react";

interface UseActionOptions<T, R> {
    onSuccess?: (data: R) => void;
    onError?: (error: Error | unknown) => void;
}

/**
 * A hook for managing async actions with idempotency (double-click prevention).
 * 
 * @param action - The async function to execute.
 * @param options - Callbacks for success and error.
 * @returns [execute, { loading, error, data }]
 */
export function useAction<T, R>(
    action: (args: T) => Promise<R>,
    options: UseActionOptions<T, R> = {}
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | unknown | null>(null);
    const [data, setData] = useState<R | null>(null);

    const execute = useCallback(
        async (args: T) => {
            if (loading) return; // Prevent concurrent execution (Idempotency)

            setLoading(true);
            setError(null);
            try {
                const result = await action(args);
                setData(result);
                if (options.onSuccess) options.onSuccess(result);
                return result;
            } catch (err: unknown) {
                setError(err);
                if (options.onError) options.onError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [action, loading, options]
    );

    return [execute, { loading, error, data }] as const;
}
