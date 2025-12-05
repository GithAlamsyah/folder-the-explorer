import { test, expect } from '@playwright/test';

test.describe('Folder Explorer E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('/');
    });

    test('should load and display the folder tree', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('.folder-tree');

        // Check that the folder tree is visible
        const folderTree = page.locator('.folder-tree');
        await expect(folderTree).toBeVisible();

        // Check that folders are loaded
        const folderNodes = page.locator('.folder-tree-node');
        await expect(folderNodes).not.toHaveCount(0);

        // Check that root folders are displayed
        await expect(page.getByText('Documents')).toBeVisible();
        await expect(page.getByText('Pictures')).toBeVisible();
    });

    test('should display empty right panel initially', async ({ page }) => {
        // Wait for the page to load
        await page.waitForSelector('.folder-list');

        // Check that the right panel shows the default message
        const emptyState = page.locator('.empty-state');
        await expect(emptyState).toBeVisible();
        await expect(emptyState).toContainText('Select a folder');
    });

    test('should select a folder and display its children', async ({ page }) => {
        // Wait for folders to load
        await page.waitForSelector('.folder-tree-node');

        // Click on "Documents" folder
        await page.locator('.folder-tree-node').filter({ hasText: 'Documents' }).first().click();

        // Wait for the right panel to update
        await page.waitForTimeout(500);

        // Check that the right panel shows children
        const folderList = page.locator('.folder-list');
        await expect(folderList).toContainText('Contents of "Documents"');

        // Check that children folders are displayed
        await expect(page.locator('.folder-item')).not.toHaveCount(0);

        // Check for specific child folders
        const rightPanel = page.locator('.right-panel');
        await expect(rightPanel.getByText('Work')).toBeVisible();
        await expect(rightPanel.getByText('Personal')).toBeVisible();
    });

    test('should highlight selected folder', async ({ page }) => {
        // Wait for folders to load
        await page.waitForSelector('.folder-tree-node');

        // Click on "Documents" folder
        const documentsRow = page.locator('.folder-row').filter({ hasText: 'Documents' }).first();
        await documentsRow.click();

        // Check that the folder is highlighted
        await expect(documentsRow).toHaveClass(/selected/);
    });

    test('should expand and collapse folders', async ({ page }) => {
        // Wait for folders to load
        await page.waitForSelector('.folder-tree-node');

        // Find expansion icon for Documents folder
        const documentsNode = page.locator('.folder-tree-node').filter({ hasText: 'Documents' }).first();
        const expandIcon = documentsNode.locator('.expand-icon').first();

        // Check initial state (collapsed)
        await expect(expandIcon).toContainText('▶');

        // Expand the folder
        await expandIcon.click();

        // Wait for animation
        await page.waitForTimeout(300);

        // Check expanded state
        await expect(expandIcon).toContainText('▼');

        // Check that children are visible in the tree
        const workNode = page.locator('.folder-tree-node').filter({ hasText: 'Work' });
        await expect(workNode).toBeVisible();

        // Collapse the folder
        await expandIcon.click();
        await page.waitForTimeout(300);

        // Check collapsed state
        await expect(expandIcon).toContainText('▶');
    });

    test('should display nested folder structure', async ({ page }) => {
        // Wait for folders to load
        await page.waitForSelector('.folder-tree-node');

        // Expand Documents
        const documentsNode = page.locator('.folder-tree-node').filter({ hasText: 'Documents' }).first();
        await documentsNode.locator('.expand-icon').first().click();
        await page.waitForTimeout(300);

        // Check that Work is visible
        await expect(page.locator('.folder-tree-node').filter({ hasText: 'Work' })).toBeVisible();

        // Click on Work to see its children in the right panel
        await page.locator('.folder-row').filter({ hasText: /^Work$/ }).first().click();
        await page.waitForTimeout(500);

        // Check right panel shows Work's children
        const folderList = page.locator('.folder-list');
        await expect(folderList).toContainText('Contents of "Work"');
    });

    test('should handle folders with no children', async ({ page }) => {
        // Wait for folders to load
        await page.waitForSelector('.folder-tree-node');

        // Expand Documents
        const documentsNode = page.locator('.folder-tree-node').filter({ hasText: 'Documents' }).first();
        await documentsNode.locator('.expand-icon').first().click();
        await page.waitForTimeout(300);

        // Expand Projects
        const projectsNode = page.locator('.folder-tree-node').filter({ hasText: 'Projects' });
        await projectsNode.locator('.expand-icon').first().click();
        await page.waitForTimeout(300);

        // Click on a leaf folder (one with no children)
        await page.locator('.folder-row').filter({ hasText: 'Full Stack' }).first().click();
        await page.waitForTimeout(500);

        // Check right panel shows no subfolders message
        const emptyState = page.locator('.empty-state');
        await expect(emptyState).toBeVisible();
        await expect(emptyState).toContainText('No subfolders');
    });

    test('should maintain state when navigating between folders', async ({ page }) => {
        // Wait for folders to load
        await page.waitForSelector('.folder-tree-node');

        // Click on Documents
        await page.locator('.folder-row').filter({ hasText: 'Documents' }).first().click();
        await page.waitForTimeout(500);

        // Verify children are shown
        await expect(page.locator('.folder-item')).not.toHaveCount(0);

        // Click on Pictures
        await page.locator('.folder-row').filter({ hasText: 'Pictures' }).first().click();
        await page.waitForTimeout(500);

        // Verify different children are shown
        const folderList = page.locator('.folder-list');
        await expect(folderList).toContainText('Contents of "Pictures"');

        // Verify Pictures is now selected
        const picturesRow = page.locator('.folder-row').filter({ hasText: 'Pictures' }).first();
        await expect(picturesRow).toHaveClass(/selected/);
    });
});
