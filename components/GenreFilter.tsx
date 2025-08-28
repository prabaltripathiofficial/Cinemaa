// components/GenreFilter.tsx
'use client';

type GenreFilterProps = {
  selectedGenres: string[];
  onToggleGenre: (genre: string) => void;
};

// A list of common movie genres
const genres = [
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror',
  'Thriller', 'Romance', 'Fantasy', 'Animation', 'Adventure'
];

export default function GenreFilter({ selectedGenres, onToggleGenre }: GenreFilterProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Genre</h3>
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <button
              key={genre}
              onClick={() => onToggleGenre(genre)}
              className={`
                px-4 py-2 rounded-full font-medium cursor-pointer
                transition-all duration-200 ease-in-out
                ${isSelected
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}