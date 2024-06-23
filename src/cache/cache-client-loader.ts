import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/server-runtime";
import cache from "./cache-service";


export interface CacheClientLoader<T = unknown> {
  data: T;
  key: string;
  serverLoader: <T = unknown>() => Promise<SerializeFrom<T>>;
}

const constructKey = (request: Request) => {
  const url = new URL(request.url);
  return url.pathname + url.search + url.hash;
};

export const cacheClientLoader = async (
  { request, serverLoader }: ClientLoaderFunctionArgs,
): Promise<CacheClientLoader> => {

  const key = constructKey(request);
  const existingData = cache.get(key);

  return {
    data: existingData,
    serverLoader,
    key,
  };
};
