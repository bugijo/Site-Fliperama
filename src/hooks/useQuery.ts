/**
 * Generic data-fetching hook.
 *
 * - Initial fetch: shows `loading = true` until the first response arrives.
 * - On error (first fetch): falls back to `fallback` data and sets `isDemo = true`.
 * - On error (background refresh): keeps the last successful data silently.
 * - Optional `interval` (ms): re-fetches in the background without flashing loading.
 * - `deps` array: re-triggers the initial fetch when values change (e.g. machine tab switch).
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface QueryState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  /** true when the API failed and the site is running on mock/fallback data */
  isDemo: boolean;
  /** true during a background refresh (data is still shown, no skeleton) */
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

export function useQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<T>,
  fallback: T,
  options: { interval?: number; deps?: unknown[] } = {}
): QueryState<T> {
  const { interval, deps = [] } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: fallback,
    loading: true,
    error: null,
    isDemo: false,
    isRefreshing: false,
    lastUpdated: null,
  });

  // Use refs so the execute callback is stable (no re-creation on each render)
  const fnRef = useRef(queryFn);
  const fallbackRef = useRef(fallback);
  fnRef.current = queryFn;
  fallbackRef.current = fallback;

  // Whether we've had at least one successful response in the current dep-set
  const hasData = useRef(false);

  const execute = useCallback((signal: AbortSignal, background = false) => {
    setState((prev) => ({
      ...prev,
      loading: !hasData.current && !background,
      isRefreshing: hasData.current || background,
    }));

    fnRef
      .current(signal)
      .then((data) => {
        if (signal.aborted) return;
        hasData.current = true;
        setState({
          data,
          loading: false,
          error: null,
          isDemo: false,
          isRefreshing: false,
          lastUpdated: new Date(),
        });
      })
      .catch((err: Error) => {
        if (signal.aborted || err.name === 'AbortError') return;
        setState((prev) => ({
          ...prev,
          loading: false,
          isRefreshing: false,
          error: err.message,
          // Only fall back to mock if we don't have any real data yet
          ...(hasData.current
            ? {}
            : { data: fallbackRef.current, isDemo: true }),
        }));
      });
  }, []); // stable — reads everything via refs

  // Primary fetch: re-runs whenever deps change
  useEffect(() => {
    hasData.current = false; // reset "has data" for the new dep-set
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      isDemo: false,
      isRefreshing: false,
    }));
    const ctrl = new AbortController();
    execute(ctrl.signal);
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, execute]);

  // Background refresh interval (does NOT show full loading skeleton)
  useEffect(() => {
    if (!interval) return;
    let ctrl = new AbortController();
    const id = setInterval(() => {
      ctrl.abort();
      ctrl = new AbortController();
      execute(ctrl.signal, true);
    }, interval);
    return () => {
      clearInterval(id);
      ctrl.abort();
    };
  }, [interval, execute]);

  return state;
}
