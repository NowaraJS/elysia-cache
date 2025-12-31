import { describe, expect, test } from 'bun:test';
import { Elysia } from 'elysia';
import { MemoryStore } from '@nowarajs/kv-store/memory';

import { cache } from '#/cache';

describe.concurrent('Cache Module', () => {
	test('should return correct cache headers for cache hit', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.get('/test', () => 'cached content', {
				isCached: {
					ttl: 10
				}
			});

		// First request - MISS
		const response1: Response = await app.handle(new Request('http://localhost/test'));
		expect(response1.status).toBe(200);
		expect(await response1.text()).toBe('cached content');
		expect(response1.headers.get('x-cache')).toBe('MISS');
		expect(response1.headers.get('cache-control')).toBe('max-age=10, public');
		expect(response1.headers.get('etag')).toBeTruthy();
		expect(response1.headers.get('last-modified')).toBeTruthy();
		expect(response1.headers.get('expires')).toBeTruthy();

		// Second request - HIT
		const response2: Response = await app.handle(new Request('http://localhost/test'));
		expect(response2.status).toBe(200);
		expect(await response2.text()).toBe('cached content');
		expect(response2.headers.get('x-cache')).toBe('HIT');
		expect(response2.headers.get('cache-control')).toBe('max-age=10, public');
		expect(response2.headers.get('last-modified')).toBe(response1.headers.get('last-modified'));
	});

	test('should cache with custom prefix', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.get('/test', () => 'cached', {
				isCached: {
					ttl: 10,
					prefix: 'custom:'
				}
			});

		const response1: Response = await app.handle(new Request('http://localhost/test'));
		expect(response1.status).toBe(200);
		expect(response1.headers.get('x-cache')).toBe('MISS');
		expect(response1.headers.get('etag')).toMatch(/^"custom:.*"$/);

		const response2: Response = await app.handle(new Request('http://localhost/test'));
		expect(response2.status).toBe(200);
		expect(response2.headers.get('x-cache')).toBe('HIT');
		expect(response2.headers.get('etag')).toMatch(/^"custom:.*"$/);
	});

	test('should expire cache after TTL', async () => {
		const store = new MemoryStore();
		const window = 2; // 2 seconds
		const app = new Elysia()
			.use(cache(store))
			.get('/test', () => 'cached', {
				isCached: {
					ttl: window
				}
			});

		// First request - MISS
		const response1: Response = await app.handle(new Request('http://localhost/test'));
		expect(response1.headers.get('x-cache')).toBe('MISS');

		// Second request - HIT
		const response2: Response = await app.handle(new Request('http://localhost/test'));
		expect(response2.headers.get('x-cache')).toBe('HIT');

		// Wait for TTL to expire
		Bun.sleepSync((window + 1) * 1000);

		// Third request - MISS again
		const response3: Response = await app.handle(new Request('http://localhost/test'));
		expect(response3.headers.get('x-cache')).toBe('MISS');
	}, { timeout: 10000 });

	test('should not cache routes without isCached', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.get('/cached', () => 'cached', { isCached: { ttl: 10 } })
			.get('/not-cached', () => 'not cached');

		// Cached route
		const cachedResponse: Response = await app.handle(new Request('http://localhost/cached'));
		expect(cachedResponse.headers.get('x-cache')).toBe('MISS');

		// Non-cached route
		const nonCachedResponse: Response = await app.handle(new Request('http://localhost/not-cached'));
		expect(nonCachedResponse.headers.get('x-cache')).toBeNull();
		expect(nonCachedResponse.headers.get('cache-control')).toBeNull();
	});

	test('should handle different cache keys for different query parameters', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.get('/test', () => 'result', {
				isCached: {
					ttl: 10
				}
			});

		// Request with param=1
		const response1: Response = await app.handle(new Request('http://localhost/test?param=1'));
		expect(response1.headers.get('x-cache')).toBe('MISS');
		const etag1 = response1.headers.get('etag');

		// Request with param=1 again - should hit cache
		const response2: Response = await app.handle(new Request('http://localhost/test?param=1'));
		expect(response2.headers.get('x-cache')).toBe('HIT');
		expect(response2.headers.get('etag')).toBe(etag1);

		// Request with param=2 - different cache key
		const response3: Response = await app.handle(new Request('http://localhost/test?param=2'));
		expect(response3.headers.get('x-cache')).toBe('MISS');
		expect(response3.headers.get('etag')).not.toBe(etag1);
	});

	test('should handle global cache with guard', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.guard({
				isCached: {
					ttl: 10
				}
			})
			.get('/test1', () => 'response1')
			.get('/test2', () => 'response2');

		// First request to /test1 - MISS
		const response1: Response = await app.handle(new Request('http://localhost/test1'));
		expect(response1.headers.get('x-cache')).toBe('MISS');

		// Second request to /test1 - HIT
		const response2: Response = await app.handle(new Request('http://localhost/test1'));
		expect(response2.headers.get('x-cache')).toBe('HIT');

		// First request to /test2 - MISS (different route)
		const response3: Response = await app.handle(new Request('http://localhost/test2'));
		expect(response3.headers.get('x-cache')).toBe('MISS');

		// Second request to /test2 - HIT
		const response4: Response = await app.handle(new Request('http://localhost/test2'));
		expect(response4.headers.get('x-cache')).toBe('HIT');
	});

	test('should override global cache TTL on specific route', async () => {
		const store = new MemoryStore();
		const window = 2;
		const app = new Elysia()
			.use(cache(store))
			.guard({
				isCached: {
					ttl: 10
				}
			})
			.get('/global-ttl', () => 'response', { isCached: { ttl: 10 } })
			.get('/override-ttl', () => 'response', { isCached: { ttl: window } });

		// /override-ttl - MISS
		const response1: Response = await app.handle(new Request('http://localhost/override-ttl'));
		expect(response1.headers.get('x-cache')).toBe('MISS');
		expect(response1.headers.get('cache-control')).toBe(`max-age=${window}, public`);

		// /override-ttl - HIT
		const response2: Response = await app.handle(new Request('http://localhost/override-ttl'));
		expect(response2.headers.get('x-cache')).toBe('HIT');
		expect(response2.headers.get('cache-control')).toMatch(/^max-age=\d+, public$/);

		// Wait for override TTL to expire
		Bun.sleepSync((window + 1) * 1000);

		// /override-ttl - MISS again
		const response3: Response = await app.handle(new Request('http://localhost/override-ttl'));
		expect(response3.headers.get('x-cache')).toBe('MISS');
	}, { timeout: 10000 });

	test('should handle Response objects correctly', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.get('/test', () => new Response('response body', { status: 200 }), {
				isCached: {
					ttl: 10
				}
			});

		// First request - MISS
		const response1: Response = await app.handle(new Request('http://localhost/test'));
		expect(response1.status).toBe(200);
		expect(await response1.text()).toBe('response body');
		expect(response1.headers.get('x-cache')).toBe('MISS');

		// Second request - HIT
		const response2: Response = await app.handle(new Request('http://localhost/test'));
		expect(response2.status).toBe(200);
		expect(await response2.text()).toBe('response body');
		expect(response2.headers.get('x-cache')).toBe('HIT');
	});

	test('should handle different HTTP methods separately', async () => {
		const store = new MemoryStore();
		const app = new Elysia()
			.use(cache(store))
			.get('/test', () => 'GET response', { isCached: { ttl: 10 } })
			.post('/test', () => 'POST response', { isCached: { ttl: 10 } });

		// GET request - MISS
		const getResponse1: Response = await app.handle(new Request('http://localhost/test', { method: 'GET' }));
		expect(await getResponse1.text()).toBe('GET response');
		expect(getResponse1.headers.get('x-cache')).toBe('MISS');

		// GET request - HIT
		const getResponse2: Response = await app.handle(new Request('http://localhost/test', { method: 'GET' }));
		expect(await getResponse2.text()).toBe('GET response');
		expect(getResponse2.headers.get('x-cache')).toBe('HIT');

		// POST request - MISS (different method)
		const postResponse1: Response = await app.handle(new Request('http://localhost/test', { method: 'POST' }));
		expect(await postResponse1.text()).toBe('POST response');
		expect(postResponse1.headers.get('x-cache')).toBe('MISS');

		// POST request - HIT
		const postResponse2: Response = await app.handle(new Request('http://localhost/test', { method: 'POST' }));
		expect(await postResponse2.text()).toBe('POST response');
		expect(postResponse2.headers.get('x-cache')).toBe('HIT');
	});
});