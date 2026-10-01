const cache = new Map();
const TTL_MS = 60 * 1000;

function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cachedEntry = cache.get(key);

  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    res.set('X-Cache', 'HIT');
    return res.status(cachedEntry.statusCode).json(cachedEntry.body);
  }

  if (cachedEntry) cache.delete(key);

  res.set('X-Cache', 'MISS');
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, {
        body,
        statusCode: res.statusCode,
        expiresAt: Date.now() + TTL_MS,
      });
    }
    return originalJson(body);
  };
  next();
}

function invalidateCacheOnMutation(req, res, next) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) cache.clear();
    });
  }
  next();
}

module.exports = { cacheMiddleware, invalidateCacheOnMutation, cache };