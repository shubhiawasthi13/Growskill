import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import mediaRoute from "./routes/media.route.js"
import purchaseRoute from "./routes/purchaseCourse.route.js"
import courseProgressRoute from "./routes/courseProgress.route.js"
import path from "path"


dotenv.config({});
connectDb();
const __dirname = path.resolve();
console.log(__dirname)
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://growskill-6gaq.onrender.com",
    credentials: true,
  })
);

// apis..........
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);


app.use(express.static(path.join(__dirname,"LMS_Frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "LMS_Frontend", "dist", "index.html"));
});



app.listen(PORT, () => {
  console.log(`Server start at port ${PORT}`);
});
