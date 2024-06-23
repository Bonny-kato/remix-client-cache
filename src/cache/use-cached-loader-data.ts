import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CacheClientLoader } from "./cache-client-loader";
import { awaitObjectProperties } from "./await-object-properties";
import cache from "./cache-service";


const useRefreshDataOnFocus = (fetchDataFromServer: () => void) => {
  useEffect(() => {
    window.addEventListener("focus", fetchDataFromServer);
    window.addEventListener("online", fetchDataFromServer);

    return () => {
      window.removeEventListener("focus", fetchDataFromServer);
      window.removeEventListener("online", fetchDataFromServer);
    };
  }, [fetchDataFromServer]);
};


const useMarkCacheEntryActive = (key: string) => {
  useEffect(() => {
    cache.markEntryAsActive(key);
    return () => {
      cache.markEntryAsInactive(key);
    };
  }, [key]);
};


export const useCachedLoaderData = <T = unknown>() => {
  const { data, key, serverLoader } =
    useLoaderData() as never as CacheClientLoader<T>;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [freshData, setFreshData] = useState<T|undefined>(() => data);
  const [error, setError] = useState(null);
  const serverLoaderRef = useRef(serverLoader);


  useEffect(() => {
    if (serverLoader) {
      serverLoaderRef.current = serverLoader;
    }
  }, [serverLoader]);


  const fetchDataFromServer = useCallback(async () => {
    if (isFetching || isLoading) return;
      setIsFetching(true);


    if (serverLoaderRef.current) {
      const response = await serverLoaderRef.current();

      const { data: _data, error } = await awaitObjectProperties(response ?? {});
      setIsFetching(false);

      if (!error) {
        setFreshData(_data as T);
        cache.set(key, _data);
      } else {
        setError(error);
      }
    }

  }, []);


  // fetch data on mount
  useEffect(() => {
    if (!data) {
      setIsLoading(true);
    }
    fetchDataFromServer().then(() => setIsLoading(false));
  }, [key]);


  useRefreshDataOnFocus(fetchDataFromServer);
  useMarkCacheEntryActive(key);

  return { data: freshData, isFetching, isLoading, error };
};
