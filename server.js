import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { generateBooks } from "./bookGenerator.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FFONTEND_URL }));
app.use(express.json());

app.get("/api/books", async (req, res) => {
  try {
    const { seed, page, language, likes, reviews } = req.query;
    console.log("Received request with parameters:", { seed, page, language, likes, reviews });

    // Validate parameters
    if (![seed, page, language, likes, reviews].every(param => param !== undefined)) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const parsedSeed = parseInt(seed, 10);
    const parsedPage = parseInt(page, 10);
    const parsedLikes = parseFloat(likes);
    const parsedReviews = parseFloat(reviews);

    if (isNaN(parsedSeed) || isNaN(parsedPage) || isNaN(parsedLikes) || isNaN(parsedReviews)) {
      return res.status(400).json({ error: "Invalid parameter values" });
    }

    console.log(`Generating books with language: ${language}`);
    const books = await generateBooks(parsedSeed, parsedPage, language, parsedLikes, parsedReviews);

    res.json(books);
  } catch (error) {
    console.error("Error in /api/books:", error);
    res.status(500).json({
      error: "Failed to generate books",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
