import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import FolderExplorer from '../FolderExplorer.vue';
import FolderTree from '../FolderTree.vue';
import FolderList from '../FolderList.vue';

// Mock the API
vi.mock('../../api', () => {
    const mockFoldersApi = {
        getAllFolders: vi.fn(() => Promise.resolve([
            { id: '1', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
            { id: '2', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
        ])),
        getFolderChildren: vi.fn(() => Promise.resolve([
            { id: '2', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
        ])),
    }
    return { 
        foldersApi: mockFoldersApi,
        default : mockFoldersApi,
     };
}
);

describe('FolderExplorer', () => {
    it('should render the component', () => {
        const wrapper = mount(FolderExplorer);
        expect(wrapper.exists()).toBe(true);
    });

    it('should render FolderTree and FolderList components', async () => {
        const wrapper = mount(FolderExplorer);
        await flushPromises();

        expect(wrapper.findComponent(FolderTree).exists()).toBe(true);
        expect(wrapper.findComponent(FolderList).exists()).toBe(true);
    });

    it('should have split panel layout', () => {
        const wrapper = mount(FolderExplorer);

        expect(wrapper.find('.left-panel').exists()).toBe(true);
        expect(wrapper.find('.right-panel').exists()).toBe(true);
        expect(wrapper.find('.resizer').exists()).toBe(true);
    });

    it('should load folders on mount', async () => {
        const wrapper = mount(FolderExplorer);
        await flushPromises();

        const folderTree = wrapper.findComponent(FolderTree);
        expect(folderTree.props('folders')).toHaveLength(2);
    });
});
