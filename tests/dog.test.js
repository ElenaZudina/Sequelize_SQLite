/** @jest-environment node */
// tests/dog.test.js
import { Sequelize, DataTypes } from 'sequelize';

// Create a new Sequelize instance for testing with an in-memory SQLite database
const mockSequelize = new Sequelize('sqlite::memory:', { logging: false });

// Declare Dog variable to be assigned after dynamic import
let Dog;

// Use jest.doMock to ensure the mock is applied before the module under test is imported.
jest.doMock('../models/index.js', () => ({
  sequelize: mockSequelize,
  connectDB: jest.fn(() => Promise.resolve(true)), // Mock connectDB to always succeed
}));

describe('Dog Model Unit Tests', () => {
    // Before all tests, dynamically import the Dog model and connect to the in-memory database
    beforeAll(async () => {
        // Dynamically import Dog after mocks are established
        // Using `await import()` will ensure the module is loaded with the mock in place.
        const dogModule = await import('../models/dog.js');
        Dog = dogModule.Dog; // Assign the exported Dog model

        await mockSequelize.authenticate(); // Test the connection
        await mockSequelize.sync({ force: true }); // Create tables, dropping existing ones
    });

    // Before each test, clear the database (if not using force: true in sync)
    beforeEach(async () => {
        // Since we use force: true in beforeAll, tables are recreated for each test suite,
        // so no need to clear data explicitly here unless testing specific scenarios
        // where data needs to persist within a describe block but be cleared between tests.
        // For simple unit tests, a fresh sync in beforeAll for the whole suite is fine.
    });

    // After all tests, close the database connection
    afterAll(async () => {
        await mockSequelize.close();
    });

    // Test case 1: Dog model existence
    test('should define the Dog model', () => {
        expect(Dog).toBeDefined();
    });

    // Test case 2: Create a valid dog entry
    test('should create a valid dog entry', async () => {
        const dog = await Dog.create({
            title: 'Labrador Retriever',
            origin: 'Canada',
            description: 'Friendly and intelligent.',
            year: 1915,
            image: '/images/labrador.jpg',
        });
        expect(dog.title).toBe('Labrador Retriever');
        expect(dog.origin).toBe('Canada');
        expect(dog.description).toBe('Friendly and intelligent.');
        expect(dog.year).toBe(1915);
        expect(dog.image).toBe('/images/labrador.jpg');
        expect(dog.createdAt).toBeDefined();
        expect(dog.updatedAt).toBeDefined();
    });

    // Test case 3: Validation for missing title
    test('should throw an error if title is missing', async () => {
        await expect(Dog.create({
            origin: 'Canada',
            description: 'Friendly and intelligent.',
            year: 1915,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 4: Validation for empty title
    test('should throw an error if title is empty', async () => {
        await expect(Dog.create({
            title: '',
            origin: 'Canada',
            description: 'Friendly and intelligent.',
            year: 1915,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 5: Validation for missing origin
    test('should throw an error if origin is missing', async () => {
        await expect(Dog.create({
            title: 'Labrador Retriever',
            description: 'Friendly and intelligent.',
            year: 1915,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 6: Validation for empty origin
    test('should throw an error if origin is empty', async () => {
        await expect(Dog.create({
            title: 'Labrador Retriever',
            origin: '',
            description: 'Friendly and intelligent.',
            year: 1915,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 7: Validation for missing description
    test('should throw an error if description is missing', async () => {
        await expect(Dog.create({
            title: 'Labrador Retriever',
            origin: 'Canada',
            year: 1915,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 8: Validation for empty description
    test('should throw an error if description is empty', async () => {
        await expect(Dog.create({
            title: 'Labrador Retriever',
            origin: 'Canada',
            description: '',
            year: 1915,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 9: Validation for missing year
    test('should throw an error if year is missing', async () => {
        await expect(Dog.create({
            title: 'Labrador Retriever',
            origin: 'Canada',
            description: 'Friendly and intelligent.',
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 10: Validation for year below min
    test('should throw an error if year is below min (1700)', async () => {
        await expect(Dog.create({
            title: 'Labrador Retriever',
            origin: 'Canada',
            description: 'Friendly and intelligent.',
            year: 1699,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 11: Validation for year above max (currentYear + 1)
    test('should throw an error if year is above max', async () => {
        const futureYear = new Date().getFullYear() + 2;
        await expect(Dog.create({
            title: 'Labrador Retriever',
            origin: 'Canada',
            description: 'Friendly and intelligent.',
            year: futureYear,
            image: '/images/labrador.jpg',
        })).rejects.toThrow();
    });

    // Test case 12: Default value for image when not provided
    test('should use default image if image is not provided', async () => {
        const dog = await Dog.create({
            title: 'Golden Retriever',
            origin: 'United Kingdom',
            description: 'Gentle and intelligent.',
            year: 1868,
            // image is not provided
        });
        expect(dog.image).toBe('/images/test.jpg');
    });

    // Test case 13: Should throw an error if image is empty string
    test('should throw an error if image is empty string', async () => {
        await expect(Dog.create({
            title: 'Golden Retriever',
            origin: 'United Kingdom',
            description: 'Gentle and intelligent.',
            year: 1868,
            image: '',
        })).rejects.toThrow();
    });

    // Test case 14: Should successfully create a dog with min year
    test('should create a dog with the minimum allowed year', async () => {
        const dog = await Dog.create({
            title: 'Ancient Breed',
            origin: 'Unknown',
            description: 'Very old dog breed.',
            year: 1700,
        });
        expect(dog.year).toBe(1700);
    });

    // Test case 15: Should successfully create a dog with max year
    test('should create a dog with the maximum allowed year', async () => {
        const currentYearPlusOne = new Date().getFullYear() + 1;
        const dog = await Dog.create({
            title: 'New Breed',
            origin: 'Modern',
            description: 'Recently developed dog breed.',
            year: currentYearPlusOne,
        });
        expect(dog.year).toBe(currentYearPlusOne);
    });
});
