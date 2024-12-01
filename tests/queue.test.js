const Queue = require('bull');
const fileQueue = new Queue('file-upload', 'redis://127.0.0.1:6379');

describe('Redis Queue', () => {
    afterAll(async () => {
        await fileQueue.close();
    });

    it('should add a job to the queue', async () => {
        const job = await fileQueue.add({ fileName: 'testfile.txt', userId: '12345' });
        expect(job.id).toBeDefined();
    });

    it('should process a job from the queue', async () => {
        const mockProcessor = jest.fn((job) => {
            expect(job.data.fileName).toBe('anotherfile.txt');
            expect(job.data.userId).toBe('12345');
        });

        fileQueue.process(mockProcessor);

        await fileQueue.add({ fileName: 'anotherfile.txt', userId: '12345' });

        await new Promise((resolve) => {
            fileQueue.on('completed', resolve);
        });

        expect(mockProcessor).toHaveBeenCalled();
    });
});
