import { Elysia } from 'elysia';

import { MemoryStore } from '@nowarajs/kv-store/memory';
import type { CacheOptions } from './types/cacheOptions';
import { generateCacheKey } from './utils/generateCacheKey';

export const cache = ({
	defaultTtl = 60,
	prefix = '',
	storage = ':memory:'
}: CacheOptions = {}) => new Elysia()
	.state(
		'kvStore',
		storage === ':memory:'
			? new MemoryStore()
			: storage
	)
	.state('_cacheKey', '')
	.onRequest(async ({ request, store, set }) => {
		const cacheKey = await generateCacheKey(request.clone());
		const cachedResponse = await store.kvStore.get(`${prefix}${cacheKey}`);

		store._cacheKey = cacheKey;

		if (cachedResponse) {
			set.headers['Cache-Control'] = `max-age=${defaultTtl}, public`;
			set.headers['X-Cache'] = 'HIT';
			set.headers['ETag'] = `"${prefix}${cacheKey}"`;
			return cachedResponse;
		}
		return void 0;
	})
	.macro({
		isCached: (enable: boolean | number) => {
			const ttl = typeof enable === 'number'
				? enable
				: (enable ? defaultTtl : 0);
			return {
				async afterHandle({ set, response, store }) {
					const cacheKey = store._cacheKey;
					const now = new Date();

					set.headers['Cache-Control'] = `max-age=${ttl}, public`;
					set.headers['ETag'] = `"${prefix}${cacheKey}"`;
					set.headers['Last-Modified'] = now.toUTCString();
					set.headers['Expires'] = new Date(now.getTime() + (ttl * 1000)).toUTCString();

					await store.kvStore.set(`${prefix}${cacheKey}`, response, ttl);
				}
			};
		}
	});