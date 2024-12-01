const mongoose = require('mongoose');
const File = require('..src/models/File');
const User = require('../models/User');

describe('File Management', () => {
    let user;

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/file-manager');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        user = await User.create({
            username: `testuser_${Date.now()}`, // Unique username
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
        });
    });

    afterEach(async () => {
        await User.deleteMany();
        await File.deleteMany();
    });

    it('should upload a file', async () => {
        const file = await File.create({
            name: 'Rwoga2.jpg',
            userId: user.id,
            filePath: '/path/to/testfile.txt',
            originalName: 'testfile.txt',
        });
        expect(file).toBeDefined();
        expect(file.name).toBe('testfile.txt');
        expect(file.userId.toString()).toBe(user.id.toString()); // Compare ObjectId properly
    });

    it('should list files for a user', async () => {
        await File.create({
            name: 'rwoga1.jpg',
            userId: user.id,
            filePath: '/path/to/file1.txt',
            originalName: 'file1_original.txt',
        });
        await File.create({
            name: 'file2.txt',
            userId: user.id,
            filePath: '/path/to/file2.txt',
            originalName: 'file2_original.txt',
        });

        const files = await File.find({ userId: user.id });
        expect(files.length).toBe(2);
        expect(files.map((f) => f.name)).toEqual(expect.arrayContaining(['file1.txt', 'file2.txt']));
    });

    it('should delete a file', async () => {
        const file = await File.create({
            name: 'deleteMe.txt',
            userId: user.id,
            filePath: '/path/to/deleteMe.txt',
            originalName: 'deleteMe_original.txt',
        });
        await File.findByIdAndDelete(file.id);

        const deletedFile = await File.findById(file.id);
        expect(deletedFile).toBeNull();
    });
});
