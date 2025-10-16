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
		- [Storage Options](#storage-options)
	- [📊 Cache Headers](#-cache-headers)
	- [📚 API Reference](#-api-reference)
	- [⚖️ License](#-license)
	- [📧 Contact](#-contact)

## 📝 Description

> High-performance caching plugin for Elysia.js with flexible storage backends.

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
bun @nowarajs/error @nowarajs/kv-store elysia
```

## ⚙️ Usage

### Basic Setup (In-Memory Store)

```ts
import { Elysia } from 'elysia'
import { cache } from '@nowarajs/elysia-cache'

// Create application with caching (uses in-memory store by default)
const app = new Elysia()
	.use(cache())
	.get('/users', async () => {
		// This response will be cached automatically
		return await fetchUsers()
	}, {
		isCached: true // Enable caching for this route
	})
	.listen(3000)
```

### Cache Configuration

```ts
import { cache } from '@nowarajs/elysia-cache'

const app = new Elysia()
	.use(cache({
		defaultTtl: 300,     // Cache for 5 minutes by default
		prefix: 'api:',      // Add prefix to cache keys
		storage: ':memory:'  // Use in-memory storage (default)
	}))
```

### Redis Store Setup (Production)

```ts
import { IoRedisStore } from '@nowarajs/kv-store'
import { cache } from '@nowarajs/elysia-cache'

// Create Redis store instance
const redisStore = new IoRedisStore({
	host: 'localhost',
	port: 6379
})
await redisStore.connect()

// Create application with Redis-backed caching
const app = new Elysia()
	.use(cache({
		storage: redisStore,
		defaultTtl: 600
	}))
```

### Route-specific Caching

```ts
const app = new Elysia()
	.use(cache({ defaultTtl: 60 }))
	.get('/fast', () => getData(), {
		isCached: 30  // Cache for 30 seconds
	})
	.get('/slow', () => getSlowData(), {
		isCached: 3600  // Cache for 1 hour
	})
	.get('/no-cache', () => getRealTimeData(), {
		isCached: false  // Disable caching
	})
```

### Storage Options

| Store Type | Usage | Best For |
|------------|-------|----------|
| Default (`:memory:`) | `cache({ defaultTtl: 60 })` | Development, single instance |
| Explicit Memory | `cache({ storage: new MemoryStore(), ... })` | When you need store reference |
| Redis Store | `cache({ storage: redisStore, ... })` | Production, distributed systems |

## 📊 Cache Headers

The plugin automatically adds these headers to all responses:

| Header | Description |
|--------|-------------|
| `Cache-Control` | Controls caching behavior (e.g., `max-age=300, public`) |
| `ETag` | Entity tag for cache validation |
| `Last-Modified` | Last modification timestamp |
| `Expires` | Expiration date and time |
| `X-Cache` | Cache status: `HIT` (from cache) or `MISS` (fresh response) |

### Example Response Headers

```
Cache-Control: max-age=300, public
ETag: "api:1234567890abcdef"
Last-Modified: Mon, 26 Aug 2025 10:30:00 GMT
Expires: Mon, 26 Aug 2025 10:35:00 GMT
X-Cache: HIT
```

## 📚 API Reference

### Cache Options

```ts
interface CacheOptions {
	/** Default TTL in seconds (default: 60) */
	defaultTtl?: number
	
	/** Cache key prefix (default: '') */
	prefix?: string
	
	/** Storage backend (default: ':memory:') */
	storage?: ':memory:' | KvStore
}
```

### Macro: `isCached`

The `isCached` macro enables caching for specific routes:

```ts
// Enable with default TTL
{ isCached: true }

// Enable with custom TTL (in seconds)
{ isCached: 300 }

// Disable caching
{ isCached: false }
```

You can find the complete API reference documentation for `Elysia Cache` at:

- [TypeDoc Documentation](https://nowarajs.github.io/elysia-cache)

## ⚖️ License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 📧 Contact

- GitHub: [NowaraJS](https://github.com/NowaraJS)
- Package: [@nowarajs/elysia-cache](https://www.npmjs.com/package/@nowarajs/elysia-cache)

