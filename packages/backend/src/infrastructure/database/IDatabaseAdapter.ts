import type { IFolderRepository } from '../../domain/repositories/IFolderRepository';

/**
 * Database Adapter Interface
 * 
 * Following Interface Segregation Principle - implements only required methods
 */
export interface IDatabaseAdapter {
    createRepository(): IFolderRepository;
    runMigrations(): Promise<void>;
}
