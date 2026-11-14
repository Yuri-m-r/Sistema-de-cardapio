import { useEffect, useState } from "react";
import type { RequestState } from "../types/sharedType";
import type { UseFetchProps } from "../types/sharedType";

// ------------- Custom hook for fetching data -------------
export const useFetch = <T>({
  fetcher,
  errorMessage,
  keepPreviousData = false,
}: UseFetchProps<T>) => {
  // ------------- State -------------
  const [response, setResponse] = useState<RequestState<T>>({
    status: "loading",
  });
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let ignore = false;
    const executeFetch = async () => {
      // ------------- Check if the previous data should be kept  -------------
      if (!keepPreviousData) {
        setResponse({ status: "loading" });
      }
      setIsFetching(true);

      try {
        // ------------- Fetch data -------------
        const data = await fetcher();

        if (!ignore) {
          setResponse({
            status: "success",
            data,
          });
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setResponse({
            status: "error",
            error: errorMessage,
          });
        }
      } finally {
        if (!ignore) {
          setIsFetching(false);
        }
      }
    };

    executeFetch();

    return () => {
      ignore = true;
    };
  }, [fetcher, errorMessage, keepPreviousData]);
  // ------------- Return data -------------
  return {
    response,
    setResponse,
    isFetching,
  };
};
