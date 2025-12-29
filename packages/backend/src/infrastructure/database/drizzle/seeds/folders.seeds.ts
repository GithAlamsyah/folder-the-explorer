import { folders } from '../schemas/folders';

export async function seedFolders(dbClient: any) {
    const seedsFolders = [
        // Root level folders (level 0)
        { id: '00000000-0000-0000-0000-000000000001', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
        { id: '00000000-0000-0000-0000-000000000002', name: 'Pictures', parentId: null, path: '/Pictures', level: 0 },
        { id: '00000000-0000-0000-0000-000000000003', name: 'Downloads', parentId: null, path: '/Downloads', level: 0 },
        { id: '00000000-0000-0000-0000-000000000004', name: 'Music', parentId: null, path: '/Music', level: 0 },
        { id: '00000000-0000-0000-0000-000000000005', name: 'Videos', parentId: null, path: '/Videos', level: 0 },

        // Documents subfolders (level 1)
        { id: '00000000-0000-0000-0000-000000000006', name: 'Work', parentId: '00000000-0000-0000-0000-000000000001', path: '/Documents/Work', level: 1 },
        { id: '00000000-0000-0000-0000-000000000007', name: 'Personal', parentId: '00000000-0000-0000-0000-000000000001', path: '/Documents/Personal', level: 1 },
        { id: '00000000-0000-0000-0000-000000000008', name: 'Projects', parentId: '00000000-0000-0000-0000-000000000001', path: '/Documents/Projects', level: 1 },

        // Work subfolders (level 2)
        { id: '00000000-0000-0000-0000-000000000009', name: 'Reports', parentId: '00000000-0000-0000-0000-000000000006', path: '/Documents/Work/Reports', level: 2 },
        { id: '00000000-0000-0000-0000-000000000010', name: 'Presentations', parentId: '00000000-0000-0000-0000-000000000006', path: '/Documents/Work/Presentations', level: 2 },
        { id: '00000000-0000-0000-0000-000000000011', name: 'Contracts', parentId: '00000000-0000-0000-0000-000000000006', path: '/Documents/Work/Contracts', level: 2 },

        // Projects subfolders (level 2)
        { id: '00000000-0000-0000-0000-000000000012', name: 'Web Development', parentId: '00000000-0000-0000-0000-000000000008', path: '/Documents/Projects/Web Development', level: 2 },
        { id: '00000000-0000-0000-0000-000000000013', name: 'Mobile Apps', parentId: '00000000-0000-0000-0000-000000000008', path: '/Documents/Projects/Mobile Apps', level: 2 },
        { id: '00000000-0000-0000-0000-000000000014', name: 'Data Science', parentId: '00000000-0000-0000-0000-000000000008', path: '/Documents/Projects/Data Science', level: 2 },

        // Web Development subfolders (level 3)
        { id: '00000000-0000-0000-0000-000000000015', name: 'Frontend', parentId: '00000000-0000-0000-0000-000000000012', path: '/Documents/Projects/Web Development/Frontend', level: 3 },
        { id: '00000000-0000-0000-0000-000000000016', name: 'Backend', parentId: '00000000-0000-0000-0000-000000000012', path: '/Documents/Projects/Web Development/Backend', level: 3 },
        { id: '00000000-0000-0000-0000-000000000017', name: 'Full Stack', parentId: '00000000-0000-0000-0000-000000000012', path: '/Documents/Projects/Web Development/Full Stack', level: 3 },

        // Pictures subfolders (level 1)
        { id: '00000000-0000-0000-0000-000000000018', name: 'Vacation', parentId: '00000000-0000-0000-0000-000000000002', path: '/Pictures/Vacation', level: 1 },
        { id: '00000000-0000-0000-0000-000000000019', name: 'Family', parentId: '00000000-0000-0000-0000-000000000002', path: '/Pictures/Family', level: 1 },
        { id: '00000000-0000-0000-0000-000000000020', name: 'Screenshots', parentId: '00000000-0000-0000-0000-000000000002', path: '/Pictures/Screenshots', level: 1 },

        // Vacation subfolders (level 2)
        { id: '00000000-0000-0000-0000-000000000021', name: '2024', parentId: '00000000-0000-0000-0000-000000000018', path: '/Pictures/Vacation/2024', level: 2 },
        { id: '00000000-0000-0000-0000-000000000022', name: '2023', parentId: '00000000-0000-0000-0000-000000000018', path: '/Pictures/Vacation/2023', level: 2 },

        // Downloads subfolders (level 1)
        { id: '00000000-0000-0000-0000-000000000023', name: 'Software', parentId: '00000000-0000-0000-0000-000000000003', path: '/Downloads/Software', level: 1 },
        { id: '00000000-0000-0000-0000-000000000024', name: 'Documents', parentId: '00000000-0000-0000-0000-000000000003', path: '/Downloads/Documents', level: 1 },
        { id: '00000000-0000-0000-0000-000000000025', name: 'Media', parentId: '00000000-0000-0000-0000-000000000003', path: '/Downloads/Media', level: 1 },

        // Music subfolders (level 1)
        { id: '00000000-0000-0000-0000-000000000026', name: 'Rock', parentId: '00000000-0000-0000-0000-000000000004', path: '/Music/Rock', level: 1 },
        { id: '00000000-0000-0000-0000-000000000027', name: 'Jazz', parentId: '00000000-0000-0000-0000-000000000004', path: '/Music/Jazz', level: 1 },
        { id: '00000000-0000-0000-0000-000000000028', name: 'Classical', parentId: '00000000-0000-0000-0000-000000000004', path: '/Music/Classical', level: 1 },

        // Videos subfolders (level 1)
        { id: '00000000-0000-0000-0000-000000000029', name: 'Movies', parentId: '00000000-0000-0000-0000-000000000005', path: '/Videos/Movies', level: 1 },
        { id: '00000000-0000-0000-0000-000000000030', name: 'Tutorials', parentId: '00000000-0000-0000-0000-000000000005', path: '/Videos/Tutorials', level: 1 },
    ];
    try {
        await dbClient.insert(folders).values(seedsFolders);
        console.log('✅ Folders seeded successfully!');
    } catch (error) {
        console.error('❌ Failed to seed folders:', error);
        throw error; // Re-throw to let parent handle the error
    }
}