import React, { ReactNode, useEffect } from "react";
import cache from "./cache-service";



const CLEANUP_INTERVAL =100000; // one minute

interface Props{
  cleanupInterval?:number
  children:ReactNode
}

export function CacheProvider({ children, cleanupInterval=CLEANUP_INTERVAL }: Props) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      cache.cleanupCache();
    }, cleanupInterval);

    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
}
