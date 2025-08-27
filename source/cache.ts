import { Elysia } from 'elysia';

import { MemoryStore } from '@nowarajs/kv-store/memory';
import type { CacheOptions } from './types/cacheOptions';
import { generateCacheKey } from './utils/generateCacheKey';
import type { CacheItem } from './types/cacheItem';

export const cache = ({
	defaultTtl = 60,
	prefix = '',
	store = ':memory:'
}: CacheOptions = {}) => new Elysia()
	.state({
		kvStore: store === ':memory:'
			? new MemoryStore()
			: store
	})
	.state({
		_cachedRoutes: new Set<string>()
	})
	.onRequest(async ({ request, store, set }) => {
		const sanitizeUrl = (new URL(request.url)).pathname;
		if (store._cachedRoutes.has(`${request.method}:${sanitizeUrl}`)) {
			const cacheKey = await generateCacheKey(request.clone());
			const cachedData = await store.kvStore.get(`${prefix}${cacheKey}`);
			if (
				cachedData
				&& typeof cachedData === 'object'
				&& 'response' in cachedData
				&& 'metadata' in cachedData
			) {
				const { response, metadata } = cachedData as CacheItem;
				set.headers['cache-control'] = `max-age=${defaultTtl}, public`;
				set.headers['x-cache'] = 'HIT';
				set.headers['etag'] = `"${prefix}${cacheKey}"`;
				set.headers['expires'] = new Date(Date.now() + (defaultTtl * 1000)).toUTCString();
				set.headers['last-modified'] = metadata.createdAt;
				return response;
			}
			set.headers['x-cache'] = 'MISS';
		}
		return void 0;
	})
	.macro({
		isCached: (enable: boolean | number) => {
			const ttl = typeof enable === 'number'
				? enable
				: (enable ? defaultTtl : 0);
			return {
				async afterHandle({ set, response, store, request }) {
					const sanitizeUrl = (new URL(request.url)).pathname;
					if (!store._cachedRoutes.has(`${request.method}:${sanitizeUrl}`))
						store._cachedRoutes.add(`${request.method}:${sanitizeUrl}`);

					const cacheKey = await generateCacheKey(request.clone());
					const now = new Date();
					set.headers['cache-control'] = `max-age=${ttl}, public`;
					set.headers['etag'] = `"${prefix}${cacheKey}"`;
					set.headers['last-modified'] = now.toUTCString();
					set.headers['expires'] = new Date(now.getTime() + (ttl * 1000)).toUTCString();

					const cacheData = {
						response,
						metadata: {
							createdAt: now.toUTCString(),
							ttl
						}
					};

					await store.kvStore.set(`${prefix}${cacheKey}`, cacheData, ttl);
				}
			};
		}
	});