// app/results/page.tsx
'use client';

import MovieCard from '@/components/MovieCard';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, JSX } from 'react';

// Define a type for our movie data
interface Movie {
  id: string;
  title: string;
  poster_url: string;
  [key: string]: unknown; // Allow other properties
}

// Helper to map genre names from our filter UI to the genre IDs from TMDb
const genreMap: { [key: string]: number } = {
  'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35, 'Drama': 18,
  'Fantasy': 14, 'Horror': 27, 'Romance': 10749, 'Sci-Fi': 878, 'Thriller': 53
};

// --- Icon Components (can be moved to a separate file) ---
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M22 10V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4h1c.9 0 1.6.8 1.6 1.7S3.9 14 3 14H2v4a2 2 0 002 2h16a2 2 0 002-2v-4h-1c-.9 0-1.6-.8-1.6-1.7S21.1 10 22 10z"/></svg>;
const TvIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-400"><path d="M21 7H3a2 2 0 00-2 2v11a2 2 0 002 2h18a2 2 0 002-2V9a2 2 0 00-2-2zm-1 12H4V10h16v9zM5 2h14v2H5z"/></svg>;

const FilterPill = ({ icon, text }: { icon: JSX.Element, text: string }) => (
  <div className="flex items-center bg-gray-700/80 text-gray-200 text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State Management ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Read filters from URL ---
  const platforms = searchParams.get('platforms');
  const rating = searchParams.get('rating');
  const genreNames = searchParams.get('genres');
  const shouldSuggest = searchParams.get('suggest') === 'true';

  // --- Data Fetching ---
  useEffect(() => {
    const fetchMovies = async () => {
      if (!platforms) return;

      const params = new URLSearchParams();
      params.append('platforms', platforms);
      if (rating) params.append('rating', rating);
      
      // Convert genre names to IDs for the API
      if (genreNames) {
        const genreIds = genreNames.split(',').map(name => genreMap[name]).filter(id => id);
        if (genreIds.length > 0) {
          params.append('genres', genreIds.join(','));
        }
      }
      
      try {
        const response = await fetch(`/api/movies?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [platforms, rating, genreNames]);

  // --- Suggestion Logic ---
  const suggestedMovie = useMemo(() => {
    if (shouldSuggest && movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      return movies[randomIndex];
    }
    return null;
  }, [shouldSuggest, movies]);

  const headingText = shouldSuggest ? "Here's Your Pick!" : "Ready For Movie Night?";

  // --- Render Logic ---
  if (isLoading) {
    return (
      <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex items-center justify-center">
        <div className="text-2xl font-bold">Finding movies...</div>
      </main>
    );
  }

  if (movies.length === 0) {
     return (
      <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold">No Movies Found</h1>
        <p className="text-gray-400 mt-4">Try adjusting your filters to find the perfect movie.</p>
        <button
          onClick={() => router.back()}
          className="mt-8 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-all duration-300"
        >
          Adjust Filters
        </button>
      </main>
    )
  }

  return (
    <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-4 sm:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            {headingText}
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            {shouldSuggest ? "We've randomly selected this movie based on your criteria." : "Here are the movies that match your preferences."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            {rating && <FilterPill icon={<StarIcon />} text={`Rating: ${rating}+`} />}
            {genreNames && <FilterPill icon={<TicketIcon />} text={`Genre: ${genreNames}`} />}
            {platforms && <FilterPill icon={<TvIcon />} text={`Platforms: ${platforms.replace(',',', ')}`} />}
          </div>
          <button
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white font-semibold transition-colors cursor-pointer flex-shrink-0"
          >
            &larr; Refine Search
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => {
            const isSuggested = movie.id === suggestedMovie?.id;
            const isDimmed = shouldSuggest && !isSuggested;
            return (
              <MovieCard
                key={movie.id}
                title={movie.title}
                posterUrl={movie.poster_url}
                isSuggested={isSuggested}
                className={isDimmed ? 'opacity-40 hover:opacity-100' : ''}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}