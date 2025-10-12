import { Router } from "express"
import { createEvent } from "../controllers/createEvent";
import { getAllEvents } from "../controllers/getAllEvents";
import { joinEvent } from "../controllers/joinEvent";
import { getFreeEvents } from "../controllers/getFreeEvents";
import { getEventsByCategory } from "../controllers/getEventsByCategory";

export const eventRouter = Router();

eventRouter.get('/', getAllEvents);
eventRouter.get('/free', getFreeEvents);
eventRouter.get('/:category', getEventsByCategory);
eventRouter.post('/create', createEvent);
eventRouter.post('/join', joinEvent);