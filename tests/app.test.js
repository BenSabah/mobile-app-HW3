const request = require('supertest');
const app = require('../src/app').default;

describe('Authentication API', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register/testuser/password123');
        expect(response.status).toBe(200);
    });

    it('should not register an existing user', async () => {
        const response = await request(app)
            .post('/register/admin/1234');
        expect(response.status).toBe(500);
    });

    it('should login a valid user', async () => {
        const response = await request(app)
            .post('/login/admin/1234');
        expect(response.status).toBe(200);
        expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/login/admin/wrongpass');
        expect(response.status).toBe(500);
    });
});

describe('Events API', () => {
    let cookie;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/login/admin/1234');
        cookie = loginResponse.headers['set-cookie'];
    });

    it('should get all events (items)', async () => {
        const response = await request(app)
            .get('/items')
            .set('Cookie', cookie);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should create a new event', async () => {
        const newEvent = {
            name: 'Test Event',
            location: 'Test Location',
            activity: 'Test Activity',
            img: 'http://test.com/image.jpg'
        };
        const response = await request(app)
            .post('/item/')
            .set('Cookie', cookie)
            .send(newEvent);

        expect(response.status).toBe(302); // Redirects to /events
        expect(response.headers.location).toBe('/events');

        // Verify it was added
        const itemsResponse = await request(app)
            .get('/items')
            .set('Cookie', cookie);
        expect(itemsResponse.body[0].name).toBe('Test Event');
    });

    it('should get a single event by id', async () => {
        const itemsResponse = await request(app)
            .get('/items')
            .set('Cookie', cookie);
        const eventId = itemsResponse.body[0].id;

        const response = await request(app)
            .get(`/item/${eventId}`)
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(eventId);
    });

    it('should update an event', async () => {
        const itemsResponse = await request(app)
            .get('/items')
            .set('Cookie', cookie);
        const event = itemsResponse.body[0];

        const updatedEvent = {
            ...event,
            name: 'Updated Name'
        };

        const response = await request(app)
            .put('/item/')
            .set('Cookie', cookie)
            .send(updatedEvent);

        expect(response.status).toBe(200);
        expect(response.text).toContain(`event ${event.id} was replaced`);

        // Verify update
        const getResponse = await request(app)
            .get(`/item/${event.id}`)
            .set('Cookie', cookie);
        expect(getResponse.body.name).toBe('Updated Name');
    });

    it('should delete an event', async () => {
        const itemsResponse = await request(app)
            .get('/items')
            .set('Cookie', cookie);
        const eventId = itemsResponse.body[0].id;

        const response = await request(app)
            .delete(`/item/${eventId}`)
            .set('Cookie', cookie);

        expect(response.status).toBe(200);

        // Verify deletion
        const getResponse = await request(app)
            .get(`/item/${eventId}`)
            .set('Cookie', cookie);
        expect(getResponse.status).toBe(404);
    });
});

describe('Public Routes and Middleware', () => {
    it('should redirect to login if not authenticated', async () => {
        const response = await request(app)
            .get('/events');
        // The middleware renders "login-page" which has status 200 by default if using res.render
        expect(response.status).toBe(200);
        expect(response.text).toContain('<title>Login</title>');
    });

    it('should render login page on root if not authenticated', async () => {
        const response = await request(app)
            .get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('<title>Login</title>');
    });

    it('should redirect to /events on root if authenticated', async () => {
        const loginResponse = await request(app)
            .post('/login/admin/1234');
        const cookie = loginResponse.headers['set-cookie'];

        const response = await request(app)
            .get('/')
            .set('Cookie', cookie);
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/events');
    });
});
