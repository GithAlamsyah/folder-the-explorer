import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FolderList from '../FolderList.vue';
import type { Folder } from '../../types';

describe('FolderList', () => {
    const mockFolders: Folder[] = [
        { id: '3', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
        { id: '4', name: 'Personal', parentId: '1', path: '/Documents/Personal', level: 1 },
    ];

    it('should render folder list', () => {
        const wrapper = mount(FolderList, {
            props: {
                folders: mockFolders,
                parentName: 'Documents',
            },
        });

        expect(wrapper.text()).toContain('Contents of "Documents"');
    });

    it('should display folder names', () => {
        const wrapper = mount(FolderList, {
            props: {
                folders: mockFolders,
                parentName: 'Documents',
            },
        });

        expect(wrapper.text()).toContain('Work');
        expect(wrapper.text()).toContain('Personal');
    });

    it('should show empty state when no folders', () => {
        const wrapper = mount(FolderList, {
            props: {
                folders: [],
                parentName: 'Documents',
            },
        });

        expect(wrapper.text()).toContain('No subfolders');
    });

    it('should show default message when no parent selected', () => {
        const wrapper = mount(FolderList, {
            props: {
                folders: [],
                parentName: '',
            },
        });

        expect(wrapper.text()).toContain('Select a folder');
    });

    it('should render folder items in grid', () => {
        const wrapper = mount(FolderList, {
            props: {
                folders: mockFolders,
                parentName: 'Documents',
            },
        });

        const folderItems = wrapper.findAll('.folder-item');
        expect(folderItems.length).toBe(2);
    });

    it('should display folder paths', () => {
        const wrapper = mount(FolderList, {
            props: {
                folders: mockFolders,
                parentName: 'Documents',
            },
        });

        expect(wrapper.text()).toContain('/Documents/Work');
        expect(wrapper.text()).toContain('/Documents/Personal');
    });
});
