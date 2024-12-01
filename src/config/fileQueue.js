const Queue = require('bull');
const { uploadFile } = require('../services/fileServices');
const redisClient = require('./redis').redis;

const fileQueue = new Queue('file-processing', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Process file upload tasks from the queue
fileQueue.process('file-upload', async (job) => {
  const { userId, file, originalName } = job.data;

  try {
    console.log(`Processing file upload for user: ${userId}`);
    const savedFilePath = await uploadFile(userId, file, originalName);

    if (!savedFilePath) {
      throw new Error('File upload service did not return a valid path.');
    }

    const fileData = JSON.stringify({
      userId,
      fileName: originalName,
      filePath: savedFilePath,
    });

    // Save file metadata to Redis
    await redisClient.lpush('uploadedFiles', fileData);

    console.log(`File upload completed for user: ${userId}`);
  } catch (error) {
    console.error(`Error processing file upload for user: ${userId}`, error);
    throw error;
  }
});

// Enhanced event listeners for the queue
fileQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

fileQueue.on('failed', (job, error) => {
  console.error(`Job failed: ${job.id}, Error: ${error.message}`);
});

fileQueue.on('error', (err) => {
  console.error('Queue error:', err.message);
});

fileQueue.on('stalled', (job) => {
  console.warn(`Job ${job.id} has stalled and will be retried`);
});

module.exports = { fileQueue };
