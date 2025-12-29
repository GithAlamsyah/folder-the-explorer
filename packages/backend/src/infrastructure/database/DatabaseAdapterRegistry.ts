import type { IDatabaseAdapter } from './IDatabaseAdapter';

const adapterRegistry: Map<string, IDatabaseAdapter> = new Map();

/**
 * Register a database adapter
 * @param adapterName - Name of the adapter
 * @param adapter - Database adapter instance
 */
export function registerAdapter(adapterName: string, adapter: IDatabaseAdapter): void {
    adapterRegistry.set(adapterName, adapter);
}

/**
 * Get a registered database adapter
 * @param adapterName - Name of the adapter
 * @returns Database adapter instance or undefined if not found
 */
export function getAdapter(adapterName: string): IDatabaseAdapter {
    const adapter = adapterRegistry.get(adapterName);
    if (!adapter) {
        throw new Error(`Adapter "${adapterName}" not found`);
    }
    return adapter;
}
