const request = require('supertest');
const { app, server } = require('../server'); // Ensure that server is correctly exported
const mongoose = require('mongoose');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');

describe('Product Routes', () => {
    let adminToken;
    let testProductId;

    beforeAll(async () => {
        // Create an admin token for authenticated routes
        adminToken = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create a test product
        const testProduct = new Product({
            name: 'Test Product',
            description: 'Test Description',
            price: 10.0,
            disponibilita: 5,
            type: 'GELATO'
        });
        await testProduct.save();
        testProductId = testProduct._id;
    });

    afterAll(async () => {
        // Cleanup the test product
        await Product.findByIdAndDelete(testProductId);

        // Close server and database connection
        await new Promise(resolve => {
            server.close(() => {
                console.log('Server closed');
                resolve();
            });
        });

        await mongoose.connection.close();
    });

    it('should get all products', async () => {
        const res = await request(app).get('/api/product').expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a single product by id', async () => {
        const res = await request(app).get(`/api/product/${testProductId}`).expect(200);

        expect(res.body).toHaveProperty('name', 'Test Product');
        expect(res.body).toHaveProperty('description', 'Test Description');
    });

    it('should get top products', async () => {
        const res = await request(app)
            .get('/api/product/getTopProducts')
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get products by IDs', async () => {
        const productIds = [testProductId];

        const res = await request(app)
            .post('/api/product/getProductsById')
            .send(productIds)
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('_id', testProductId.toString());
    });
});
