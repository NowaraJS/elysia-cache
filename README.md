# 💾 NowaraJS - Elysia Cache

## 📌 Table of Contents

- [💾 NowaraJS - Elysia Cache](#-nowarajs---elysia-cache)
    - [📌 Table of Contents](#-table-of-contents)
    - [📝 Description](#-description)
    - [✨ Features](#-features)
    - [🔧 Installation](#-installation)
    - [⚙️ Usage](#-usage)
        - [Basic Setup (In-Memory Store)](#basic-setup-in-memory-store)
        - [Cache Configuration](#cache-configuration)
        - [Redis Store Setup (Production)](#redis-store-setup-production)
        - [Route-specific Caching](#route-specific-caching)
        - [Global Caching with Guard](#global-caching-with-guard)
        - [Cache Options](#cache-options)
    - [📊 Cache Headers](#-cache-headers)
    - [📚 API Reference](#-api-reference)
    - [⚖️ License](#-license)
    - [📧 Contact](#-contact)

## 📝 Description

**Elysia Cache** provides a simple yet powerful caching system for Elysia.js applications. It supports both in-memory caching and custom storage backends through the `@nowarajs/kv-store` ecosystem, automatic cache key generation based on request parameters, TTL management, and HTTP cache headers for optimal performance and client awareness.

## ✨ Features

- 🚀 **Automatic Cache Key Generation**: Smart cache keys based on request URL, method, and body
- 🏪 **Multiple Storage Backends**: Support for in-memory and Redis storage via @nowarajs/kv-store
- ⏱️ **Flexible TTL Management**: Configurable time-to-live per route or globally
- 📦 **HTTP Cache Headers**: Automatic ETag, Cache-Control, Last-Modified, and Expires headers
- 🎯 **Cache Hit/Miss Tracking**: Monitor cache performance with X-Cache headers
- 🛠️ **Easy Integration**: Simple plugin architecture for Elysia
- 🔄 **Development Ready**: In-memory storage for local development
- ⚡ **High Performance**: Optimized for minimal latency impact

## 🔧 Installation

```bash
bun add @nowarajs/elysia-cache
```

### Peer Dependencies

#### Required :

```bash
bun add @nowarajs/error @nowarajs/kv-store elysia
```

## ⚙️ Usage

### Basic Setup (In-Memory Store)

```ts
import { Elysia } from 'elysia';
import { cache } from '@nowarajs/elysia-cache';

// Create application with caching (uses in-memory store by default)
const app = new Elysia()
	.use(cache())
	.get(
		'/users',
		async () => {
			// This response will be cached automatically
			return await fetchUsers();
		},
		{
			isCached: {
				ttl: 300 // Cache for 5 minutes
			}
		}
	)
	.listen(3000);
```

### Cache Configuration

```ts
import { cache } from '@nowarajs/elysia-cache';

// Using in-memory store (default)
const app = new Elysia().use(cache());
```

### Redis Store Setup (Production)

```ts
import { IoRedisStore } from '@nowarajs/kv-store/ioredis'; // or you can use BunRedis with /bun-redis
import { cache } from '@nowarajs/elysia-cache';

// Create Redis store instance
const redisStore = new IoRedisStore({
	host: 'localhost',
	port: 6379
});
await redisStore.connect();

// Create application with Redis-backed caching
const app = new Elysia().use(cache(redisStore));
```

### Route-specific Caching

```ts
const app = new Elysia()
	.use(cache())
	.get('/fast', () => getData(), {
		isCached: { ttl: 30 } // Cache for 30 seconds
	})
	.get('/slow', () => getSlowData(), {
		isCached: { ttl: 3600 } // Cache for 1 hour
	})
	.get('/prefixed', () => getData(), {
		isCached: { ttl: 60, prefix: 'api:' } // With custom prefix
	});
```

### Global Caching with Guard

You can apply caching to multiple routes at once using Elysia's `.guard()`:

```ts
const app = new Elysia()
	.use(cache())
	.guard({
		isCached: { ttl: 60 } // Apply to all routes in this guard
	})
	.get('/users', () => getUsers())
	.get('/posts', () => getPosts())
	.get('/comments', () => getComments());
```

### Cache Options

| Option   | Type     | Default    | Description                      |
| -------- | -------- | ---------- | -------------------------------- |
| `ttl`    | `number` | _required_ | Time-to-live in seconds          |
| `prefix` | `string` | `''`       | Cache key prefix for namespacing |

## 📊 Cache Headers

The plugin automatically adds these headers to cached routes (routes with `isCached` option):

| Header          | Description                                                 |
| --------------- | ----------------------------------------------------------- |
| `Cache-Control` | Controls caching behavior (e.g., `max-age=300, public`)     |
| `ETag`          | Entity tag for cache validation                             |
| `Last-Modified` | Last modification timestamp                                 |
| `Expires`       | Expiration date and time                                    |
| `X-Cache`       | Cache status: `HIT` (from cache) or `MISS` (fresh response) |

### Example Response Headers

```
Cache-Control: max-age=300, public
ETag: "api:1234567890abcdef"
Last-Modified: Mon, 26 Aug 2025 10:30:00 GMT
Expires: Mon, 26 Aug 2025 10:35:00 GMT
X-Cache: HIT
```

## 📚 API Reference

You can find the complete API reference documentation for `Elysia Cache` at:

- [Reference Documentation](https://nowarajs.github.io/elysia-cache)

## ⚖️ License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 📧 Contact

- Mail: [nowarajs@pm.me](mailto:nowarajs@pm.me)
- GitHub: [NowaraJS](https://github.com/NowaraJS)
