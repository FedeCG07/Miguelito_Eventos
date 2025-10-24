import "dotenv/config"

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"

import { userRouter } from "./routers/userRouter";
import { eventRouter } from "./routers/eventRouter";
import { categoryRouter } from "./routers/categoryRouter";

const app = express()
export default app;

app.use(express.json())
app.use(cookieParser())
app.use(cors());

app.use('/user', userRouter)
app.use('/event', eventRouter)
app.use('/category', categoryRouter)

app.listen(8000, () => {
  console.log(`App listening on http://localhost:8000`)
})