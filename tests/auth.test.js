const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

describe('User Authentication', () => {
    let user, token;

    beforeAll(async () => {
        process.env.JWT_SECRET_TOKEN = 'testsecret'; // Set JWT secret
        await mongoose.connect('mongodb://127.0.0.1:27017/file-manager');
    });

    afterAll(async () => {
        await User.deleteMany();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        user = await User.create({
            username: `testuser_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
        });
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' }); // Generate valid token
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    it('should authenticate a valid user', async () => {
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled(); // Verify next() was called
        expect(req.user).toBeDefined(); // Check that req.user is set
        expect(req.user.id).toBe(user.id); // Verify the user ID
        expect(res.status).not.toHaveBeenCalled(); // Ensure no error response
    });

    it('should reject an invalid token', async () => {
        const req = { headers: { authorization: 'Bearer invalidtoken' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(next).not.toHaveBeenCalled(); // Ensure next() was not called
        expect(res.status).toHaveBeenCalledWith(401); // Check for 401 status
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' }); // Verify error message
    });
});
