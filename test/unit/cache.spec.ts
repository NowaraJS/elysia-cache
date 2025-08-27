import { describe, test, expect } from 'bun:test';

import { cache } from '#/cache';

describe('Cache Module', () => {
	test('should cache slow responses and serve them quickly', async () => {
		const sleepDuration = 5000; // 5 seconds
		const cacheTtl = 10; // 10-second TTL

		const cachePlugin = cache({ defaultTtl: cacheTtl }).get(
			'/slow-route',
			() => {
				Bun.sleepSync(sleepDuration);
				return 'ok';
			},
			{ isCached: true }
		);

		// First request - should take ~5 seconds
		const startTime1 = Date.now();
		const response1 = await cachePlugin.handle(new Request('http://localhost/slow-route'));
		const duration1 = Date.now() - startTime1;

		expect(await response1.text()).toBe('ok');
		expect(duration1).toBeGreaterThanOrEqual(sleepDuration);
		expect(response1.headers.get('x-cache')).toBe('MISS');

		// Second immediate request - should be instantaneous (cache hit)
		const startTime2 = Date.now();
		const response2 = await cachePlugin.handle(new Request('http://localhost/slow-route'));
		const duration2 = Date.now() - startTime2;

		expect(await response2.text()).toBe('ok');
		expect(duration2).toBeLessThan(100);
		expect(response2.headers.get('x-cache')).toBe('HIT');

		// Third request - still within TTL
		const startTime3 = Date.now();
		const response3 = await cachePlugin.handle(new Request('http://localhost/slow-route'));
		const duration3 = Date.now() - startTime3;

		expect(await response3.text()).toBe('ok');
		expect(duration3).toBeLessThan(100);
		expect(response3.headers.get('x-cache')).toBe('HIT');
	}, { timeout: 15000 });

	test('should expire cache after TTL', async () => {
		const sleepDuration = 2000; // 2 seconds
		const cacheTtl = 3; // 3-second TTL

		const cachePlugin = cache({ defaultTtl: cacheTtl }).get(
			'/expiring-route',
			() => {
				Bun.sleepSync(sleepDuration);
				return 'ok';
			},
			{ isCached: true }
		);

		// First request - should take ~2 seconds
		const startTime1 = Date.now();
		const response1 = await cachePlugin.handle(new Request('http://localhost/expiring-route'));
		const duration1 = Date.now() - startTime1;

		expect(await response1.text()).toBe('ok');
		expect(duration1).toBeGreaterThanOrEqual(sleepDuration);
		expect(response1.headers.get('x-cache')).toBe('MISS');

		// Second immediate request - should be instantaneous (cache hit)
		const startTime2 = Date.now();
		const response2 = await cachePlugin.handle(new Request('http://localhost/expiring-route'));
		const duration2 = Date.now() - startTime2;

		expect(await response2.text()).toBe('ok');
		expect(duration2).toBeLessThan(100);
		expect(response2.headers.get('x-cache')).toBe('HIT');

		// Wait for TTL to expire
		Bun.sleepSync((cacheTtl + 1) * 1000);

		// Third request - should take ~2 seconds again (cache miss)
		const startTime3 = Date.now();
		const response3 = await cachePlugin.handle(new Request('http://localhost/expiring-route'));
		const duration3 = Date.now() - startTime3;

		expect(await response3.text()).toBe('ok');
		expect(duration3).toBeGreaterThanOrEqual(sleepDuration);
		expect(response3.headers.get('x-cache')).toBe('MISS');
	}, { timeout: 15000 });

	test('should set all cache headers correctly', async () => {
		const sleepDuration = 1000; // 1 second
		const cacheTtl = 10; // 10-second TTL

		const cachePlugin = cache({ defaultTtl: cacheTtl, prefix: 'test:' }).get(
			'/header-route',
			() => {
				Bun.sleepSync(sleepDuration);
				return 'cached content';
			},
			{ isCached: true }
		);

		// First request - should have MISS headers
		const response1 = await cachePlugin.handle(new Request('http://localhost/header-route'));
		expect(await response1.text()).toBe('cached content');

		// Check MISS headers
		expect(response1.headers.get('x-cache')).toBe('MISS');
		expect(response1.headers.get('cache-control')).toBe(`max-age=${cacheTtl}, public`);
		expect(response1.headers.get('etag')).toMatch(/^"test:.*"$/);
		expect(response1.headers.get('last-modified')).toBeTruthy();
		expect(response1.headers.get('expires')).toBeTruthy();

		// Second request - should have HIT headers
		const response2 = await cachePlugin.handle(new Request('http://localhost/header-route'));
		expect(await response2.text()).toBe('cached content');

		// Check HIT headers
		expect(response2.headers.get('x-cache')).toBe('HIT');
		expect(response2.headers.get('cache-control')).toBe(`max-age=${cacheTtl}, public`);
		expect(response2.headers.get('etag')).toMatch(/^"test:.*"$/);
		expect(response2.headers.get('last-modified')).toBeTruthy();
		expect(response2.headers.get('expires')).toBeTruthy();

		// Verify Last-Modified is consistent between requests (same creation time)
		expect(response1.headers.get('last-modified')).toBe(response2.headers.get('last-modified'));
	}, { timeout: 10000 });

	test('should not execute cache logic for non-cached routes', async () => {
		const cachePlugin = cache({ defaultTtl: 10 })
			.get('/cached', () => 'cached', { isCached: true })
			.get('/not-cached', () => 'not cached');

		// Request to cached route
		const cachedResponse = await cachePlugin.handle(new Request('http://localhost/cached'));
		expect(await cachedResponse.text()).toBe('cached');
		expect(cachedResponse.headers.get('x-cache')).toBe('MISS');

		// Request to non-cached route
		const nonCachedResponse = await cachePlugin.handle(new Request('http://localhost/not-cached'));
		expect(await nonCachedResponse.text()).toBe('not cached');
		expect(nonCachedResponse.headers.get('x-cache')).toBeNull();
		expect(nonCachedResponse.headers.get('cache-control')).toBeNull();
	}, { timeout: 5000 });

	test('should handle query parameters in cache keys', async () => {
		const cachePlugin = cache({ defaultTtl: 10 }).get(
			'/query-route',
			({ query }) => `result-${query.param}`,
			{ isCached: true }
		);

		// First request with param=1
		const response1 = await cachePlugin.handle(new Request('http://localhost/query-route?param=1'));
		expect(await response1.text()).toBe('result-1');
		expect(response1.headers.get('x-cache')).toBe('MISS');

		// Second request with param=1 (should hit cache)
		const response2 = await cachePlugin.handle(new Request('http://localhost/query-route?param=1'));
		expect(await response2.text()).toBe('result-1');
		expect(response2.headers.get('x-cache')).toBe('HIT');

		// Third request with param=2 (should miss cache)
		const response3 = await cachePlugin.handle(new Request('http://localhost/query-route?param=2'));
		expect(await response3.text()).toBe('result-2');
		expect(response3.headers.get('x-cache')).toBe('MISS');
	}, { timeout: 5000 });
});
