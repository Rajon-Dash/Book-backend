import seedrandom from "seedrandom";
import { fakerEN, fakerDE, fakerFR } from "@faker-js/faker";

// Mapping languages to Faker locales
const langMap = {
  en: fakerEN,
  de: fakerDE,
  fr: fakerFR,
};

export async function generateBooks(seed, page, language = "en", likesAvg = 5, reviewsAvg = 3) {
  try {
    if (!Number.isInteger(seed)) throw new Error("Invalid seed");
    if (!Number.isInteger(page)) throw new Error("Invalid page");

    // Select the correct Faker locale
    const selectedFaker = langMap[language] || fakerEN;

    // Use seeded random number generator for consistent data
    const metaRng = seedrandom(`${seed}-${page}`);
    selectedFaker.seed(metaRng());

    const booksData = Array.from({ length: 20 }, (_, index) => {
      const bookSeed = seed + page + index;
      selectedFaker.seed(bookSeed);

      const book = {
        id: (page - 1) * 20 + index + 1,
        isbn: selectedFaker.string.numeric(13),
        title: selectedFaker.lorem.words(3),
        author: selectedFaker.person.fullName(),
        publisher: selectedFaker.company.name(),
      };

      // Generate likes
      const likesRng = seedrandom(`${bookSeed}-likes`);
      book.likes = Math.floor(likesAvg) + (likesRng() < (likesAvg % 1) ? 1 : 0);

      // Generate reviews
      const reviewsRng = seedrandom(`${bookSeed}-reviews`);
      let reviewCount =
        Math.floor(reviewsAvg) + (reviewsRng() < (reviewsAvg % 1) ? 1 : 0);

      selectedFaker.seed(reviewsRng());
      book.reviews = Array.from({ length: reviewCount }, () => ({
        text: selectedFaker.lorem.sentence(),
        reviewer: selectedFaker.person.fullName(),
      }));

      // Generate image URL based on the book's ID
      const coverRng = seedrandom(`${bookSeed}-cover`);
      book.imageURL = `https://picsum.photos/200/300?random=${Math.floor(coverRng() * 1000)}`;

      return book;
    });

    return booksData;
  } catch (error) {
    console.error("Error in generateBooks:", error);
    throw new Error(`Book generation failed: ${error.message}`);
  }
}
