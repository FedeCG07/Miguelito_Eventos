import "dotenv/config"

import express from 'express';
import cookieParser from 'cookie-parser';

import { userRouter } from "./routers/userRouter";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/user', userRouter)

app.listen(8000, () => {
  console.log(`App listening on http://localhost:8000`)
})