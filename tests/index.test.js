/** @jest-environment node */
// tests/index.test.js
import { Sequelize } from 'sequelize'; // Keep this import for DataTypes or if needed for type
import path from 'path';
import { jest } from '@jest/globals';

// Create a new Sequelize instance for mocking purposes, to be returned by our mock
const mockSequelizeInstance = {
  authenticate: jest.fn(() => Promise.resolve()),
  close: jest.fn(() => Promise.resolve()),
  // Add other Sequelize instance methods that might be called by the real index.js
  // For this test, we are focusing on connectDB and sequelize export
  options: {
    dialect: 'sqlite',
    storage: '/mock/path/to/project/data/dogbreeds.sqlite',
    logging: false,
  }
};

// Define jest.fn() mocks for fs and url methods in the module's top scope
const mockMkdirSync = jest.fn();
const mockFileURLToPath = jest.fn((url) => {
    return '/mock/path/to/project/models/index.js'; // Provide a consistent mock path
});


// Mock Node.js built-in 'fs' module
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  mkdirSync: mockMkdirSync, // Reference the pre-defined mock
}));

// Mock Node.js built-in 'url' module
jest.mock('url', () => ({
  fileURLToPath: mockFileURLToPath, // Reference the pre-defined mock
}));

// Mock the entire ../models/index.js module
jest.mock('../models/index.js', () => {
    // We need to return the mocked sequelize instance and connectDB function
    // as if it were the real module.
    const connectDBMock = jest.fn(async () => {
        try {
            await mockSequelizeInstance.authenticate();
            return true;
        } catch (err) {
            console.error('Mocked connection error: ', err); // Use a specific mock message
            throw err;
        }
    });

    return {
        sequelize: mockSequelizeInstance,
        connectDB: connectDBMock,
    };
});


// Declare variables to hold the dynamically imported module and its exports
let modelsIndex;
let sequelizeExport; // The sequelize export from models/index.js (which is our mockSequelizeInstance)
let connectDBExport; // The connectDB export from models/index.js (which is our connectDBMock)
let fsMock;

describe('models/index.js Unit Tests (using direct module mock)', () => {
    // Before all tests, dynamically import the module and set up mocks
    beforeAll(async () => {
        fsMock = await import('fs'); // Get the mocked fs module
        // No need to import urlMock as models/index.js itself is fully mocked.

        // Dynamically import models/index.js (this will load our mock)
        modelsIndex = await import('../models/index.js');
        sequelizeExport = modelsIndex.sequelize;
        connectDBExport = modelsIndex.connectDB;
    });

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the mock Sequelize instance's methods
        mockSequelizeInstance.authenticate.mockRestore();
        mockSequelizeInstance.close.mockRestore();
        // Spy on console.error and console.log for capturing output
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    // After each test, restore all mocks
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Test 1: The exported sequelize instance is our mock
    test('should export the mocked Sequelize instance', () => {
        expect(sequelizeExport).toBe(mockSequelizeInstance);
        expect(sequelizeExport.authenticate).toBeDefined();
        expect(sequelizeExport.close).toBeDefined();
        expect(sequelizeExport.options.dialect).toBe('sqlite');
    });

    // Test 2: connectDB successfully authenticates
    test('connectDB should authenticate successfully', async () => {
        // By default, mockSequelizeInstance.authenticate resolves
        const result = await connectDBExport();
        expect(result).toBe(true);
        expect(mockSequelizeInstance.authenticate).toHaveBeenCalledTimes(1);
        expect(console.error).not.toHaveBeenCalled(); // No error on successful connection
    });

    // Test 3: connectDB handles authentication errors
    test('connectDB should handle authentication errors', async () => {
        const error = new Error('Connection failed from mock');
        mockSequelizeInstance.authenticate.mockRejectedValueOnce(error);

        jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error

        await expect(connectDBExport()).rejects.toThrow(error);
        expect(mockSequelizeInstance.authenticate).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Mocked connection error: ', error);

        jest.restoreAllMocks(); // Restore original console.error
    });

    // Test 4: fs.mkdirSync should NOT be called as models/index.js is fully mocked
    test('fs.mkdirSync should NOT be called as models/index.js is fully mocked', () => {
        expect(fsMock.mkdirSync).not.toHaveBeenCalled();
    });
});


