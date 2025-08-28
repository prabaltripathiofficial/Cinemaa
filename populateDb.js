// populateDb.js

import 'dotenv/config';
import axios from 'axios';
// Correct way to import the CommonJS firebase-admin module
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };

const { initializeApp, credential, firestore } = admin;

// --- CONFIGURATION ---
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

// --- VALIDATION ---
if (!TMDB_API_KEY || !FIREBASE_PROJECT_ID) {
  console.error("Error: Make sure TMDB_API_KEY and FIREBASE_PROJECT_ID are set in your .env file.");
  process.exit(1);
}

// --- INITIALIZE FIREBASE ADMIN ---
admin.initializeApp({
  // Use the destructured credential object
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
});

const db = admin.firestore();
const moviesCollection = db.collection('movies');
console.log('Firebase Admin Initialized.');

// --- HELPER FUNCTIONS ---
const fetchPopularMovies = async (page = 1) => {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&region=IN`;
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching page ${page} of popular movies:`, error.message);
    return [];
  }
};

const fetchMovieProviders = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`;
  try {
    const response = await axios.get(url);
    const providers = response.data.results.IN?.flatrate || [];
    return providers.map((p) => p.provider_name);
  } catch (error) {
    return [];
  }
};

// --- MAIN SCRIPT LOGIC ---
const populateDatabase = async () => {
  console.log('Starting database population...');
  let moviesAdded = 0;

  for (let page = 31; page <= 100; page++) {
    console.log(`Fetching movies from page ${page}...`);
    const movies = await fetchPopularMovies(page);

    for (const movie of movies) {
      if (!movie.poster_path || movie.popularity < 10) continue;
      const providers = await fetchMovieProviders(movie.id);
      if (providers.length === 0) continue;

      const movieData = {
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        imdb_rating: movie.vote_average,
        genres: movie.genre_ids,
        platforms: providers,
        achievements: [],
      };

      await moviesCollection.doc(String(movie.id)).set(movieData);
      moviesAdded++;
      console.log(`Added: ${movie.title}`);
    }
  }

  console.log(`\n--- Population Complete! ---`);
  console.log(`Successfully added ${moviesAdded} movies to the database.`);
  process.exit(0);
};

// Run the main function
populateDatabase();