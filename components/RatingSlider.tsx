// components/RatingSlider.tsx
'use client';

type RatingSliderProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
};

export default function RatingSlider({ rating, onRatingChange }: RatingSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">IMDb Rating</h3>
        <span className="bg-gray-700 text-white text-lg font-bold px-4 py-1 rounded-md border border-white/10">
          {rating.toFixed(1)}+
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="0.1"
        value={rating}
        onChange={(e) => onRatingChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
      />
    </div>
  );
}