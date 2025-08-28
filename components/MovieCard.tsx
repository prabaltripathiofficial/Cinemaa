// components/MovieCard.tsx
import Image from 'next/image';

type MovieCardProps = {
  title: string;
  posterUrl: string;
  isSuggested?: boolean;
  className?: string; // Add className prop
};

// Accept className and apply it to the main div
export default function MovieCard({ title, posterUrl, isSuggested = false, className }: MovieCardProps) {
  return (
    <div className={`
      group rounded-lg overflow-hidden relative transition-all duration-300
      ${isSuggested ? 'ring-4 ring-red-500 scale-105 shadow-2xl shadow-red-500/40 z-20' : ''}
      ${className} // Apply the passed className here
    `}>
      {isSuggested && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse">
          SUGGESTED
        </div>
      )}
      <Image
        src={posterUrl}
        alt={`Poster for ${title}`}
        width={500}
        height={750}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
        <h3 className="text-white text-lg font-bold truncate group-hover:whitespace-normal">{title}</h3>
      </div>
    </div>
  );
}