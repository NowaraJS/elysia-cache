export interface CacheOptions {
	/**
	 * TTL in seconds
	 */
	ttl: number;

	/**
	 * Cache key prefix
	 *
	 * @defaultValue ''
	 */
	prefix?: string;
}