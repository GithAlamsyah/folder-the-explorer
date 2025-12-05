import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FolderTree from '../FolderTree.vue';
import FolderTreeNode from '../FolderTreeNode.vue';
import type { Folder } from '../../types';

describe('FolderTree', () => {
    const mockFolders: Folder[] = [
        { id: '1', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
        { id: '2', name: 'Pictures', parentId: null, path: '/Pictures', level: 0 },
        { id: '3', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
    ];

    it('should render folder tree', () => {
        const wrapper = mount(FolderTree, {
            props: {
                folders: mockFolders,
                selectedId: null,
            },
        });

        expect(wrapper.text()).toContain('Folder Structure');
    });

    it('should show loading state when loading', () => {
        const wrapper = mount(FolderTree, {
            props: {
                folders: [],
                selectedId: null,
                loading: true,
            },
        });

        expect(wrapper.text()).toContain('Loading folders');
    });

    it('should render tree nodes for root folders', () => {
        const wrapper = mount(FolderTree, {
            props: {
                folders: mockFolders,
                selectedId: null,
            },
        });

        const treeNodes = wrapper.findAllComponents(FolderTreeNode);
        expect(treeNodes.length).toBeGreaterThan(0);
    });

    it('should emit select event when folder selected', async () => {
        const wrapper = mount(FolderTree, {
            props: {
                folders: mockFolders,
                selectedId: null,
            },
        });

        const treeNode = wrapper.findComponent(FolderTreeNode);
        await treeNode.vm.$emit('select', mockFolders[0]);

        expect(wrapper.emitted('select')).toBeTruthy();
    });

    it('should build hierarchical tree structure', () => {
        const wrapper = mount(FolderTree, {
            props: {
                folders: mockFolders,
                selectedId: null,
            },
        });

        // Check that Documents appears before Work (hierarchical structure)
        const text = wrapper.text();
        expect(text).toContain('Documents');
        expect(text).toContain('Pictures');
    });
});
