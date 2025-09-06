// Simple in-memory cache for API responses
const cache = {};
export async function cachedFetch(url, options = {}, ttl = 60000) {
  const now = Date.now();
  if (cache[url] && now - cache[url].ts < ttl) {
    return cache[url].data;
  }
  const res = await fetch(url, options);
  const data = await res.json();
  cache[url] = { data, ts: now };
  return data;
}
