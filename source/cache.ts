import { MemoryStore } from '@nowarajs/kv-store/memory';
import type { KvStore } from '@nowarajs/kv-store/types';
import { Elysia } from 'elysia';

import type { CacheItem } from './types/cache-item';
import type { CacheOptions } from './types/cache-options';
import { generateCacheKey } from './utils/generate-cache-key';

export const cache = (store: KvStore = new MemoryStore()) => {
	const cachedRoutes = new Map<string, CacheOptions>();

	return new Elysia()
		.onRequest(async ({ request, set }) => {
			const route = `${request.method}:${(new URL(request.url)).pathname}`;
			if (cachedRoutes.has(route)) {
				const { ttl, prefix } = cachedRoutes.get(route) as CacheOptions;
				const cacheKey = await generateCacheKey(request.clone());
				const cacheItem = await store.get(`${prefix}${cacheKey}`) as CacheItem | undefined;

				if (
					cacheItem
					&& typeof cacheItem === 'object'
					&& 'response' in cacheItem
					&& 'metadata' in cacheItem
				) {
					const createdAt = new Date((cacheItem).metadata.createdAt);
					const expiresAt = new Date(createdAt.getTime() + (ttl * 1000));
					const now = Date.now();
					const remaining = Math.max(0, Math.ceil((expiresAt.getTime() - now) / 1000));

					set.headers['cache-control'] = `max-age=${remaining}, public`;
					set.headers['etag'] = `"${prefix}${cacheKey}"`;
					set.headers['last-modified'] = (cacheItem).metadata.createdAt;
					set.headers['expires'] = expiresAt.toUTCString();
					set.headers['x-cache'] = 'HIT';
					if (cacheItem.response instanceof Response)
						return cacheItem.response.clone();
					return cacheItem.response;
				}
				set.headers['x-cache'] = 'MISS';
			}
			return void 0;
		})
		.macro({
			isCached: ({ ttl, prefix = '' }: CacheOptions) => ({
				async afterHandle({ set, responseValue, request }) {
					const route = `${request.method}:${(new URL(request.url)).pathname}`;
					if (!cachedRoutes.has(route))
						cachedRoutes.set(route, { ttl, prefix });

					const cacheKey = await generateCacheKey(request.clone());
					const now = new Date();
					set.headers['cache-control'] = `max-age=${ttl}, public`;
					set.headers['etag'] = `"${prefix}${cacheKey}"`;
					set.headers['last-modified'] = now.toUTCString();
					set.headers['expires'] = new Date(now.getTime() + (ttl * 1000)).toUTCString();
					set.headers['x-cache'] = 'MISS';

					const cacheItem: CacheItem = {
						response: responseValue instanceof Response
							? responseValue.clone()
							: responseValue,
						metadata: {
							createdAt: now.toUTCString()
						}
					};

					await store.set(`${prefix}${cacheKey}`, cacheItem, ttl);
				}
			})
		});
};
