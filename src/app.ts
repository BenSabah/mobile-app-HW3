import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import {authController} from './controllers/AuthController';
import {eventController} from './controllers/EventController';
import {authMiddleware} from './middleware/authMiddleware';

const app = express();

// configure app
app.use('/public', express.static(path.join(__dirname, '../public')));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// --- PUBLIC ROUTES ---
app.post("/register/:username/:password", (req, res) => authController.register(req, res));
app.post("/login/:username/:password", (req, res) => authController.login(req, res));

// --- AUTHENTICATION MIDDLEWARE ---
app.use(authMiddleware);

// --- PROTECTED ROUTES ---
app.get("/events", (req, res) => eventController.getEventsPage(req, res));
app.get("/items", (req, res) => eventController.getItems(req, res));
app.post("/item/", (req, res) => eventController.createItem(req, res));
app.get("/item/:id", (req, res, next) => eventController.getItem(req, res, next));
app.delete("/item/:id", (req, res, next) => eventController.deleteItem(req, res, next));
app.put("/item/", (req, res, next) => eventController.updateItem(req, res, next));

// catch 404 and forward to the error handler
app.use((_req, res) => {
    res.status(404).send('Not Found');
});

export default app;
