type CacheData = {
  data: unknown;
  expiry: number;
  key: string;
};

class CacheService {
  static cacheClient: Map<string, CacheData> = new Map<string, CacheData>();
  private static activeEntries = new Set();
  private static TTL = 30000; // 30 second

  static get(key: string): unknown | null {
    if (CacheService.cacheClient.has(key)) {
      const cacheData = CacheService.cacheClient.get(key);
      return cacheData?.data;
    } else return null;
  }

  static set(key: string, data: unknown) {
    const expiry = Date.now() + this.TTL;
    CacheService.cacheClient.set(key, { data, expiry, key }); // data and expiry time are stored together
  }
  static delete(key: string) {
    CacheService.cacheClient.delete(key);
  }
  static clear() {
    CacheService.cacheClient.clear();
  }

  static markEntryAsActive(key: string) {
    this.activeEntries.add(key);
  }

  static markEntryAsInactive(key: string) {
    this.activeEntries.delete(key);
  }

  static getAll = () => {
    return this.cacheClient;
  };

  static cleanupCache() {
    for (const [key, cachedItem] of this.cacheClient) {
      if (this.hasExpired(cachedItem)) {
        console.log("[remove-cache]", key);
        this.cacheClient.delete(key);
      }
    }
  }

  private static hasExpired = ({ key, expiry }: CacheData) => {
    const now = new Date();
    return now.getTime() - expiry && !this.activeEntries.has(key);
  };
}

export default CacheService;
