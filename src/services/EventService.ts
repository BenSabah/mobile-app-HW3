import {Event} from '../models/Event';
import {generateGuid} from '../utils/idGenerator';
import {generateTimeStamp} from '../utils/timeUtils';

export class EventService {
    private events: Event[] = [{
        name: "Basketball game, need 3 more players",
        time: 1498071600000,
        location: "Chicago, park",
        activity: "basketball",
        img: "https://s-media-cache-ak0.pinimg.com/originals/32/77/9d/32779d944a90b66478da7e58a359d4a8.jpg",
        id: "0"
    }, {
        name: "Ninja turtles meeting, need 2 more turtles",
        time: 1498941000000,
        location: "TA, Top st 23",
        activity: "kicking bad guys",
        img: "https://www.syfy.com/sites/syfy/files/styles/hero_image__large__computer__alt/public/batman_vs._tmnt_group.jpeg",
        id: "1"
    }];

    getAll(): Event[] {
        return this.events;
    }

    getById(id: string): Event | undefined {
        return this.events.find(e => e.id === id);
    }

    create(eventData: Omit<Event, 'id' | 'time'>): Event {
        const newEvent: Event = {
            ...eventData,
            id: generateGuid(),
            time: generateTimeStamp()
        };
        this.events.unshift(newEvent);
        return newEvent;
    }

    update(id: string, eventData: Partial<Event>): Event | null {
        const event = this.getById(id);
        if (event) {
            event.name = eventData.name ?? event.name;
            event.time = generateTimeStamp();
            event.location = eventData.location ?? event.location;
            event.activity = eventData.activity ?? event.activity;
            event.img = eventData.img ?? event.img;
            return event;
        }
        return null;
    }

    delete(id: string): boolean {
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
            this.events.splice(index, 1);
            return true;
        }
        return false;
    }
}

export const eventService = new EventService();
