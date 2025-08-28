// app/page.tsx

'use client'; // This line is important for using hooks like useState

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define a type for our platform data for better code quality with TypeScript
type Platform = {
  id: string;
  name: string;
  logoUrl: string;
};

// --- Our List of Platforms ---
const platforms: Platform[] = [
  { id: 'Netflix', name: 'Netflix', logoUrl: '/logos/netflix.svg' },
  { id: 'Amazon Prime Video', name: 'Prime Video', logoUrl: '/logos/prime-video.svg' },
  { id: 'JioHotstar', name: 'Disney+ Hotstar', logoUrl: '/logos/hotstar.svg' },
  { id: 'Sony Liv', name: 'SonyLIV', logoUrl: '/logos/sony.svg' },
  { id: 'zee5', name: 'ZEE5', logoUrl: '/logos/zee5.svg' },
  { id: 'jio', name: 'JioCinema', logoUrl: '/logos/jio.svg' },
];

export default function Home() {
  const router = useRouter(); // Initialize the router
  // State to keep track of selected platform IDs
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleNextClick = () => {
    if (selectedPlatforms.length > 0) {
      const params = new URLSearchParams();
      params.append('platforms', selectedPlatforms.join(','));
      router.push(`/filters?${params.toString()}`);
    }
  };


  // --- UX Logic ---
  // Function to handle platform selection
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prevSelected) => {
      if (prevSelected.includes(platformId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== platformId);
      } else {
        // If not selected, add it
        return [...prevSelected, platformId];
      }
    });
  };
  
  // Check if the "Next" button should be enabled
  const isNextButtonEnabled = selectedPlatforms.length > 0;

  return (
    <main className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center w-full max-w-2xl">
        {/* --- 1. Header --- */}
        <h1 className="text-5xl md:text-6xl font-bold">
          Cine<span className="text-red-600">मा</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Select your streaming platforms to get started.
        </p>

        {/* --- 2. Platform Grid (Cool UI) --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12">
          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <div
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`
                  p-4 bg-gray-800 rounded-xl cursor-pointer
                  border-2 border-transparent 
                  transition-all duration-300 ease-in-out
                  transform hover:scale-105 hover:bg-gray-700
                  ${isSelected ? 'border-red-600 ring-2 ring-red-500/50' : 'opacity-60 hover:opacity-100'}
                `}
              >
                <div className="relative h-16 w-full">
                   {/* If you don't have images yet, you can just show the name */}
                   {/* <p className="text-center">{platform.name}</p> */}
                   <Image
                    src={platform.logoUrl}
                    alt={`${platform.name} logo`}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 3. Next Button (Awesome UX) --- */}
        <div className="mt-16">
          <button
            onClick={handleNextClick} 
            disabled={!isNextButtonEnabled}
            className={`
              w-full max-w-xs mx-auto py-3 px-6 rounded-lg text-xl cursor-pointer font-semibold
              transition-all duration-300 ease-in-out
              ${isNextButtonEnabled
                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Next
          </button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        <p>
          Created with ❤️ by{' '}
          <a
            href="https://github.com/prabaltripathiofficial" // You can change this link
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            Prabal
          </a>
        </p>
      </footer>
    </main>
  );
}