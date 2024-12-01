const Queue = require('bull');

// Connect to the Redis queue
const fileQueue = new Queue('file-upload', 'redis://127.0.0.1:6379');

// Job handler functions
const jobHandlers = {
    'file-upload': handleFileUpload,
};

// Define the file-upload handler
async function handleFileUpload(job) {
    const { userId } = job.data;

    try {
        if (!userId || !file || !originalName) {
            throw new Error('Missing required job data.');
        }

        console.log(`Processing file: ${originalName} for user: ${userId}`);
        // Simulate file saving or processing
        console.log(`File ${originalName} processed successfully.`);
    } catch (error) {
        console.error(`Error in handleFileUpload: ${error.message}`);
        throw error; // Fail the job explicitly
    }
}

// Dynamically route jobs to handlers
fileQueue.process(async (job) => {
    console.log('Processing job:', job.data);

    const jobType = job.data.type;

    if (jobHandlers[jobType]) {
        try {
            await jobHandlers[jobType](job);
        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error.message);
            throw error;
        }
    } else {
        console.error(`No handler found for job type: ${jobType}`);
        throw new Error(`Missing process handler for job type ${jobType}`);
    }
});

// Event listeners
fileQueue.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
});

fileQueue.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id} - ${err.message}`);
});
