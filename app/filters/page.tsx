// app/filters/page.tsx
'use client';

import { useState, Suspense } from 'react'; // 1. Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import GenreFilter from '@/components/GenreFilter';
import RatingSlider from '@/components/RatingSlider';
import AchievementsFilter from '@/components/AchievementsFilter';

// 2. Move all of your page logic into a new component
function FiltersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // This hook now works inside Suspense

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(7.0);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);

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
    const platforms = searchParams.get('platforms');

    if (!platforms) {
      alert("No platforms selected! Redirecting to home.");
      router.push('/');
      return;
    }

    const params = new URLSearchParams();
    params.append('platforms', platforms);
    params.append('rating', minRating.toString());
    if (selectedGenres.length > 0) {
      params.append('genres', selectedGenres.join(','));
    }
    if (suggest) {
      params.append('suggest', 'true');
    }

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
          Just One Step Away...
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Fine-tune your preferences to find the perfect movie.
        </p>
      </div>

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

      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigateToResults(true)}
          className="bg-transparent border-2 border-red-600 text-red-500 font-bold py-3 px-8 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 w-full sm:w-auto">
          Suggest For Me
        </button>
        <button
          onClick={() => navigateToResults(false)}
          className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-all duration-300 w-full sm:w-auto">
          Show Movies
        </button>
      </div>
    </div>
  );
}

// 3. Your main page component now wraps the content in <Suspense>
export default function FiltersPage() {
  return (
    <main className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-4 sm:p-8">
      <Suspense fallback={<div>Loading filters...</div>}>
        <FiltersPageContent />
      </Suspense>
    </main>
  );
}
