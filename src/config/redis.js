const Redis = require('ioredis');
const Queue = require('bull');

// Initialize Redis connection with enhanced error handling
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  reconnectOnError: (err) => {
    console.error('Redis reconnectOnError triggered:', err.message);
    return true; // Retry connection on errors
  },
  maxRetriesPerRequest: null, // No limit on retries
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

redis.on('connect', () => {
  console.log('Connected to Redis successfully');
});


// Test Redis connection
redis.ping()
  .then((result) => {
    console.log('Redis connection test successful:', result); // Should print 'PONG'
  })
  .catch((err) => {
    console.error('Redis connection test failed:', err.message);
    process.exit(1); // Exit process if Redis is not reachable
  });

// Function to create a Bull queue
function createQueue(queueName) {
  return new Queue(queueName, {
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
  });
}

module.exports = { redis, createQueue };
