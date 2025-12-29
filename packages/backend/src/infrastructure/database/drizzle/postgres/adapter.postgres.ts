import type { IDatabaseAdapter } from "../../IDatabaseAdapter";
import type { IFolderRepository } from "../../../../domain/repositories/IFolderRepository";
import { PostgresFolderRepository } from "./repositories/FolderRepository";
import { postgresMigration } from "./migrate.postgres";

/**
 * Postgres Database Adapter
 * 
 * Following Dependency Inversion Principle
 */
export const PostgresAdapter: IDatabaseAdapter = {
    createRepository(): IFolderRepository {
        return new PostgresFolderRepository();
    },
    async runMigrations(): Promise<void> {
        return postgresMigration();
    }
}