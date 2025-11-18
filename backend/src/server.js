import express from "express"
import noteRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001

app.use(cors({
    origin : "http://localhost:5173",
    })
);
//middleware
app.use(express.json()); //parise JSON body. req.body
app.use(rateLimiter);

// our simple custom middleware
// app.use((req, res, next) =>{
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`)
//     next();
// })

app.use("/api/notes", noteRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT)
    });
})

