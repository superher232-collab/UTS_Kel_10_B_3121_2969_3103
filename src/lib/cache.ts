// src/lib/cache.ts
type CacheEntry<T> = {
  data: T
  timestamp: number
}

const cacheMap = new Map<string, CacheEntry<any>>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

export async function withCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const cached = cacheMap.get(key)
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }
  const freshData = await fetchFn()
  cacheMap.set(key, { data: freshData, timestamp: now })
  return freshData
}
