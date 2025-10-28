  import "dotenv/config"

  import express from 'express';
  import cookieParser from 'cookie-parser';
  import cors from "cors"
  import path from "path";

  const uploadPath = path.join(process.cwd(), "../uploads");

  import { userRouter } from "./routers/userRouter";
  import { eventRouter } from "./routers/eventRouter";
  import { categoryRouter } from "./routers/categoryRouter";

  const app = express()
  export default app;

  app.use(express.json())
  app.use(cookieParser())
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

  import multer from "multer";

  const storage = multer.diskStorage({
    destination: path.join(uploadPath, "../uploads"),
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });

  const upload = multer({ storage });

  // Ruta para subir imágenes
  app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No se subió ningún archivo" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file!.filename}`;
    res.json({ url: imageUrl });
  });

  app.use('/user', userRouter)
  app.use('/event', eventRouter)
  app.use('/category', categoryRouter)
  app.use("/uploads", express.static(uploadPath));

  app.listen(8000, () => {
    console.log(`App listening on http://localhost:8000`)
  })