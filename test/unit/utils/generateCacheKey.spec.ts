import { describe, expect, it } from 'bun:test';

import { generateCacheKey } from '#/utils/generateCacheKey';

describe('generateCacheKey', () => {
	it('should generate cache key for request with body', async () => {
		const testBody = JSON.stringify({ test: 'data' });
		const request = new Request('https://example.com/api/test', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: testBody
		});

		const cacheKey = await generateCacheKey(request);

		expect(typeof cacheKey).toBe('string');
		expect(cacheKey).toMatch(/^[a-f0-9]{64}$/); // Should be a 64-character hex string (SHA-256)
		expect(cacheKey.length).toBe(64);
		// Should not contain the literal body
		expect(cacheKey).not.toContain('{"test":"data"}');
	});

	it('should generate cache key for request without body', async () => {
		const request = new Request('https://example.com/api/get', {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		const cacheKey = await generateCacheKey(request);

		expect(typeof cacheKey).toBe('string');
		expect(cacheKey).toMatch(/^[a-f0-9]{64}$/); // Should be a 64-character hex string (SHA-256)
		expect(cacheKey.length).toBe(64);
	});

	it('should generate same cache key for identical requests', async () => {
		const requestData = {
			url: 'https://example.com/api/test',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ test: 'data' })
		};

		const request1 = new Request(requestData.url, requestData);
		const request2 = new Request(requestData.url, requestData);

		const cacheKey1 = await generateCacheKey(request1);
		const cacheKey2 = await generateCacheKey(request2);

		expect(cacheKey1).toBe(cacheKey2);
	});

	it('should generate different cache keys for different bodies', async () => {
		const request1 = new Request('https://example.com/api/test', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ test: 'data1' })
		});

		const request2 = new Request('https://example.com/api/test', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ test: 'data2' })
		});

		const cacheKey1 = await generateCacheKey(request1);
		const cacheKey2 = await generateCacheKey(request2);

		expect(cacheKey1).not.toBe(cacheKey2);
	});
});
