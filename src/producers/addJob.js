const Queue = require('bull');
const fileQueue = new Queue('file-upload', 'redis://127.0.0.1:6379');

// Add a job to the queue with the correct structure
fileQueue.add(
    'file-upload', // The job type
    {
        userId: 'user_id', // The user
        file: 'path/to/file.jpg', // The file to upload
        originalName: 'file.jpg', // The name of the file
    },
    {
        attempts: 3, // Retry the job up to 3 times if it fails
        backoff: 5000, // Wait 5 seconds between retries
    }
);

console.log('Job added to the queue.');
