const Queue = require('bull');

// Initialize Redis-based queue with enhanced error handling
const fileQueue = new Queue('file-upload', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Queue event listeners
fileQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

fileQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

fileQueue.on('error', (err) => {
  console.error('Redis Queue error:', err.message);
});

fileQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} has stalled and will be retried`);
});

module.exports = fileQueue;
