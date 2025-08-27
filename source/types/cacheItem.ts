export interface CacheItem {
	response: unknown;
	metadata: {
		createdAt: string;
		ttl: number;
	};
}
