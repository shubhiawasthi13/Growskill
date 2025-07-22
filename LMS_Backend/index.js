import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { User } from "./modal/user.modal.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";

dotenv.config({});
connectDb();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://groww-skill.netlify.app",
    credentials: true,
  })
);

// apis..........
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.post("/api/v1/generate", isAuthenticated, async (req, res) => {
  const { courseTitle } = req.body;
  const prompt = `Generate 20 interview questions *with their answers* for a student who completed the course titled "${courseTitle}". 
Format it like:
1. What is ...?
Answer: ...
2. How does ... work?
Answer: ...`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free", // Free public model
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OR_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    const questions = raw
      .split(/\d+\.\s/)
      .filter((q) => q.trim())
      .map((q) => q.trim());

    res.json({ questions });
  } catch (err) {
    console.error("❌ OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/v1/certificate", isAuthenticated, async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId).select("name");
  const { courseName } = req.body;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 🧠 Embed Lucide "BrainCircuit" icon (PNG)
    const iconPath = path.join(__dirname, "./assets/brain-circuit.png");
    const iconBytes = fs.readFileSync(iconPath);
    const brainIcon = await pdfDoc.embedPng(iconBytes);
    const desiredHeight = 24;
    const iconDims = {
      width: (brainIcon.width * desiredHeight) / brainIcon.height,
      height: desiredHeight,
    };

    const iconX = 30; // shifted a bit right to avoid left border
    const iconY = 355; // lowered to avoid top border

    page.drawImage(brainIcon, {
      x: iconX,
      y: iconY,
      width: iconDims.width,
      height: iconDims.height,
    });

    // 🖋️ Logo Text
    const siteName = "GrowSkill";
    const textX = iconX + iconDims.width + 10;

    page.drawText(siteName, {
      x: textX,
      y: iconY + 5,
      size: 24,
      font: boldFont,
    });

    // 🟦 Thick Border
    page.drawRectangle({
      x: 10,
      y: 10,
      width: 580,
      height: 380,
      borderColor: rgb(0.2, 0.2, 0.6),
      borderWidth: 4,
    });

    // 🏆 Certificate Heading
    const heading = "Certificate of Completion";
    page.drawText(heading, {
      x: (600 - boldFont.widthOfTextAtSize(heading, 22)) / 2,
      y: 330,
      size: 20,
      font: boldFont,
      color: rgb(0.15, 0.15, 0.5),
    });

    // 🎓 Main Content
    const presentedText = "This certificate is proudly presented to";
    page.drawText(presentedText, {
      x: (600 - font.widthOfTextAtSize(presentedText, 14)) / 2,
      y: 280,
      size: 14,
      font,
    });

    page.drawText(user.name.toUpperCase(), {
      x: (600 - boldFont.widthOfTextAtSize(user.name.toUpperCase(), 18)) / 2,
      y: 250,
      size: 18,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.7),
    });

    const recognitionText =
      "in recognition of the successful completion of the course";
    page.drawText(recognitionText, {
      x: (600 - font.widthOfTextAtSize(recognitionText, 14)) / 2,
      y: 220,
      size: 14,
      font,
    });

    page.drawText(`"${courseName}"`, {
      x: (600 - font.widthOfTextAtSize(`"${courseName}"`, 16)) / 2,
      y: 190,
      size: 16,
      font: boldFont,
      color: rgb(0.1, 0.3, 0.7),
    });

    // 💬 Motivation message
    const appreciation = `Your dedication and efforts are truly appreciated.\nKeep learning, keep growing!`;
    appreciation.split("\n").forEach((line, i) => {
      page.drawText(line, {
        x: (600 - font.widthOfTextAtSize(line, 12)) / 2,
        y: 160 - i * 15,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    });

    // 📅 Date
    page.drawText(`Date Issued: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: 60,
      size: 12,
      font,
    });

    // ✍️ Signature
    page.drawText("Shubhi Awasthi\nAdmin, GrowSkill LMS", {
      x: 400,
      y: 50,
      size: 12,
      font,
      color: rgb(0.2, 0.2, 0.2),
      lineHeight: 14,
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );
    res.send(pdfBytes);
  } catch (err) {
    console.error("PDF error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate certificate" });
  }
});

app.listen(PORT, () => {
  console.log(`Server start at port ${PORT}`);
});
