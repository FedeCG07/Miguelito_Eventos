import { Router } from "express"
import { createEvent } from "../controllers/createEvent";
import { getAllEvents } from "../controllers/getAllEvents";
import { joinEvent } from "../controllers/joinEvent";
import { getFreeEvents } from "../controllers/getFreeEvents";
import { getEventsByCategory } from "../controllers/getEventsByCategory";
import { getJoinedEvents } from "../controllers/getEventsJoinedByUser";
import { getAssistingUsers } from "../controllers/getAssistingUsers";
import { cancelReservations } from "../controllers/cancelReservations";

export const eventRouter = Router();

eventRouter.get('/', getAllEvents);
eventRouter.get('/free', getFreeEvents);
eventRouter.post('/create', createEvent);
eventRouter.post('/join', joinEvent);
eventRouter.get('/joined', getJoinedEvents);
eventRouter.get('/assisting/:id', getAssistingUsers);
eventRouter.get('/:category', getEventsByCategory);
eventRouter.post('/unreserve', cancelReservations);