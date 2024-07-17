const request = require('supertest');
const { app, server, io } = require('../server'); // Assicurati che server sia correttamente esportato
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('POST /api/user/login', () => {
    it('should login an existing user', async () => {
        const credentials = {
            email: 'admin@admin.it',
            password: '123456'
        };

        const res = await request(app)
            .post('/api/user/login')
            .send(credentials)
            .expect(200);

        // Verifica che la risposta contenga il messaggio di login riuscito e il token
        expect(res.body.isValid).toBe(true);
        expect(res.body.message).toBe('Login successful');
        expect(res.body).toHaveProperty('token');

        // Verifica che il token sia valido decodificandolo
        const decodedToken = jwt.verify(res.body.token, 'chiaveSegreta');
        expect(decodedToken.username).toBe('admin');
    });

    it('should return 400 if user is not found', async () => {
        const credentials = {
            email: 'nonexistentuser@example.com',
            password: '123456'
        };

        const res = await request(app)
            .post('/api/user/login')
            .send(credentials)
            .expect(400);

        // Verifica che la risposta contenga il messaggio di errore appropriato
        expect(res.body.isValid).toBe(false);
        expect(res.body.message).toBe('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
        const credentials = {
            email: 'admin@admin.it',
            password: 'wrongpassword'
        };

        const res = await request(app)
            .post('/api/user/login')
            .send(credentials)
            .expect(400);

        // Verifica che la risposta contenga il messaggio di errore appropriato
        expect(res.body.isValid).toBe(false);
        expect(res.body.message).toBe('Incorrect password');
    });

    afterAll(async () => {
        await new Promise(resolve => {
            server.close(() => {
                console.log('Server closed');
                resolve();
            });
        });

        // Chiudi tutte le connessioni socket
        for (const socket of Object.values(io.sockets.sockets)) {
            socket.disconnect(true);
        }

        // Chiudi la connessione a MongoDB
        await mongoose.connection.close();
    });
});
