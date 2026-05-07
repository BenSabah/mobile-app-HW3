import {NextFunction, Request, Response} from 'express';
import {eventService} from '../services/EventService';

export class EventController {
    getEventsPage(_req: Request, res: Response) {
        const events = eventService.getAll();
        console.log("Events being rendered:", JSON.stringify(events, null, 2));
        res.render("events", {events: events});
    }

    getItems(_req: Request, res: Response) {
        res.send(eventService.getAll());
    }

    createItem(req: Request, res: Response) {
        eventService.create(req.body);
        res.redirect("/events");
    }

    getItem(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        let event = eventService.getById(<string>id);
        if (event) {
            res.send(event);
        } else {
            next();
        }
    }

    deleteItem(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;
        if (eventService.delete(<string>id)) {
            console.log("deleted event id = " + id);
            res.sendStatus(200);
        } else {
            next();
        }
    }

    updateItem(req: Request, res: Response, next: NextFunction) {
        const id = req.body.id;
        if (eventService.update(id, req.body)) {
            res.send("event " + id + " was replaced");
        } else {
            next();
        }
    }
}

export const eventController = new EventController();
