// components/AchievementsFilter.tsx
'use client';

type AchievementsFilterProps = {
  selectedAchievements: string[];
  onToggleAchievement: (achievement: string) => void;
};

const achievements = [
  'Oscar-Winning',
  'Golden Globe Nominee',
  'Critically Acclaimed',
  'Cult Classic',
];

export default function AchievementsFilter({
  selectedAchievements,
  onToggleAchievement,
}: AchievementsFilterProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Accolades & Recognition</h3>
      <div className="flex flex-wrap gap-3">
        {achievements.map((achievement) => {
          const isSelected = selectedAchievements.includes(achievement);
          return (
            <button
              key={achievement}
              onClick={() => onToggleAchievement(achievement)}
              className={`
                px-4 py-2 rounded-full font-medium text-sm
                transition-all duration-200 ease-in-out cursor-pointer border-2
                ${isSelected
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }
              `}
            >
              {achievement}
            </button>
          );
        })}
      </div>
    </div>
  );
}