// app/filters/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Make sure this is imported
import GenreFilter from '@/components/GenreFilter';
import RatingSlider from '@/components/RatingSlider';
import AchievementsFilter from '@/components/AchievementsFilter';

export default function FiltersPage() {
  const router = useRouter(); // Initialize router
  const searchParams = useSearchParams();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(7.0);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);

  // --- Handler Functions (no changes here) ---
  const handleToggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };
  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
  };
  const handleToggleAchievement = (achievement: string) => {
    setSelectedAchievements((prev) =>
      prev.includes(achievement)
        ? prev.filter((a) => a !== achievement)
        : [...prev, achievement]
    );
  };

   const navigateToResults = (suggest: boolean) => {
    // Read platforms from the URL instead of using a placeholder
    const platforms = searchParams.get('platforms');

    if (!platforms) {
      // Handle case where no platforms are passed, maybe redirect back
      alert("No platforms selected!");
      router.push('/');
      return;
    }

    const params = new URLSearchParams();
    params.append('platforms', platforms); // Use the real platforms
    params.append('rating', minRating.toString());
    if (selectedGenres.length > 0) {
      // We need to convert genre names to IDs for the API
      // We'll handle this in the final step on the results page
      params.append('genres', selectedGenres.join(','));
    }
    if (suggest) {
      params.append('suggest', 'true');
    }

    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* --- 1. Header with Back Button --- */}
        <div className="relative text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
            Just One Step Away...
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Fine-tune your preferences to find the perfect movie.
          </p>
        </div>

        {/* --- Filter Sections (no changes here) --- */}
        <div className="space-y-8">
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <GenreFilter selectedGenres={selectedGenres} onToggleGenre={handleToggleGenre} />
          </div>
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <RatingSlider rating={minRating} onRatingChange={handleRatingChange} />
          </div>
          <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <AchievementsFilter selectedAchievements={selectedAchievements} onToggleAchievement={handleToggleAchievement} />
          </div>
        </div>

        {/* --- Action Buttons with Updated Logic --- */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
                onClick={() => navigateToResults(true)} // Suggest a movie
                className="bg-transparent border-2 border-red-600 text-red-500 font-bold py-3 px-8 cursor-pointer rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 w-full sm:w-auto">
                Suggest For Me
            </button>
            <button
                onClick={() => navigateToResults(false)} // Show all movies
                className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-all cursor-pointer duration-300 w-full sm:w-auto">
                Show Movies
            </button>
        </div>
      </div>
    </main>
  );
}