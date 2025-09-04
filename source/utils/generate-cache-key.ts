import type { Request } from 'undici-types';

/**
 * Calculates a hash from a readable stream using Bun's CryptoHasher
 */
const _calculateBodyHash = async (body: ReadableStream | null, hasher: Bun.CryptoHasher): Promise<void> => {
	if (!body)
		return;
	const reader = body.getReader();

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done)
				break;
			if (value)
				hasher.update(new Uint8Array(value));
		}
	} finally {
		reader.releaseLock();
	}
};

/**
 * Generates a cache key from a request
 */
export const generateCacheKey = async (request: Request): Promise<string> => {
	const { method, url, headers } = request;
	const hasher = new Bun.CryptoHasher('sha256');
	hasher.update(method);
	hasher.update(url);
	hasher.update(JSON.stringify(headers));
	await _calculateBodyHash(request.body, hasher);
	return hasher.digest('hex');
};
