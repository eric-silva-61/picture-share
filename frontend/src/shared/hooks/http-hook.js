import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeRequests = useRef([]);

  useEffect(() => {
    return () => {
      activeRequests.current.forEach((ac) => ac.abort());
    };
  }, []);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      setError(null);
      const httpAbortCtrl = new AbortController();
      activeRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeRequests.current = activeRequests.current.filter(
          (c) => c !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return [isLoading, error, sendRequest, clearError];
};
