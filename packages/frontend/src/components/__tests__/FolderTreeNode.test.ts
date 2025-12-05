import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FolderTreeNode from '../FolderTreeNode.vue';
import type { FolderNode } from '../../types';

describe('FolderTreeNode', () => {
    const mockFolder: FolderNode = {
        id: '1',
        name: 'Documents',
        parentId: null,
        path: '/Documents',
        level: 0,
        children: [],
        isExpanded: false,
    };

    const mockFolderWithChildren: FolderNode = {
        id: '1',
        name: 'Documents',
        parentId: null,
        path: '/Documents',
        level: 0,
        children: [
            {
                id: '2',
                name: 'Work',
                parentId: '1',
                path: '/Documents/Work',
                level: 1,
                children: [],
                isExpanded: false,
            },
        ],
        isExpanded: false,
    };

    it('should render folder name', () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolder,
                selectedId: null,
            },
        });

        expect(wrapper.text()).toContain('Documents');
    });

    it('should show expand icon when folder has children', () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolderWithChildren,
                selectedId: null,
            },
        });

        expect(wrapper.find('.expand-icon').exists()).toBe(true);
        expect(wrapper.find('.expand-icon').text()).toBe('▶');
    });

    it('should not show expand icon when folder has no children', () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolder,
                selectedId: null,
            },
        });

        expect(wrapper.find('.expand-icon-placeholder').exists()).toBe(true);
    });

    it('should emit select event when clicked', async () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolder,
                selectedId: null,
            },
        });

        await wrapper.find('.folder-row').trigger('click');

        expect(wrapper.emitted('select')).toBeTruthy();
        expect(wrapper.emitted('select')?.[0]).toEqual([mockFolder]);
    });

    it('should apply selected class when selected', () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolder,
                selectedId: '1',
            },
        });

        expect(wrapper.find('.folder-row').classes()).toContain('selected');
    });

    it('should emit toggle event when expand icon clicked', async () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolderWithChildren,
                selectedId: null,
            },
        });

        await wrapper.find('.expand-icon').trigger('click');

        expect(wrapper.emitted('toggle')).toBeTruthy();
        expect(wrapper.emitted('toggle')?.[0]).toEqual([mockFolderWithChildren]);
    });

    it('should apply correct indentation based on depth', () => {
        const wrapper = mount(FolderTreeNode, {
            props: {
                node: mockFolder,
                selectedId: null,
                depth: 2,
            },
        });

        const element = wrapper.find('.folder-tree-node').element as HTMLElement;
        expect(element.style.paddingLeft).toBe('40px'); // depth 2 * 20px
    });

    it('should show expanded icon when folder is expanded', () => {
        const expandedFolder = { ...mockFolderWithChildren, isExpanded: true };

        const wrapper = mount(FolderTreeNode, {
            props: {
                node: expandedFolder,
                selectedId: null,
            },
        });

        expect(wrapper.find('.expand-icon').text()).toBe('▼');
    });
});
