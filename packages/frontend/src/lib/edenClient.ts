import { treaty } from '@elysiajs/eden';
import type { App } from '@monorepo/backend';

/**
 * API base URL - defaults to localhost:3000 for development
 * Can be configured via environment variable
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Eden Treaty client instance
 * Provides end-to-end type safety with Elysia backend
 * 
 * Usage:
 * ```typescript
 * const { data, error } = await api.api.v1.folders.get();
 * ```
 */
export const api = treaty<App>(API_URL);

export type ApiClient = typeof api;
