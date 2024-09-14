import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface PlayerStats {
  level: number;
  health: number;
  experience: number;
  strength: number;
}

export default function PlayerStats() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // User is authenticated, fetch stats from Supabase
          const { data, error } = await supabase
            .from('Stats')
            .select('level, health, experience, strength')
            .eq('profileId', user.id)
            .single();

          if (error) throw error;
          setStats(data);
        } else {
          // User is not authenticated, get stats from local storage
          const localStats = localStorage.getItem('playerStats');
          if (localStats) {
            setStats(JSON.parse(localStats));
          } else {
            // Set default stats if not found in local storage
            const defaultStats: PlayerStats = {
              level: 1,
              health: 100,
              experience: 0,
              strength: 10
            };
            setStats(defaultStats);
            localStorage.setItem('playerStats', JSON.stringify(defaultStats));
          }
        }
      } catch (e) {
        setError('Failed to fetch stats');
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const calculateXpForNextLevel = (level: number) => {
    return level * 100;
  };

  if (loading) return <div className="text-center">Loading stats...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!stats) return <div className="text-center">No stats found</div>;

  const xpForNextLevel = calculateXpForNextLevel(stats.level);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-[150px] mx-auto">
      <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1 text-center">Stats</h2>
      <div className="flex flex-col space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium">Level:</span>
          <span className="text-red-500">{stats.level}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Health:</span>
          <span className="text-green-500">{stats.health}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">XP:</span>
          <span className="text-blue-500">{stats.experience}/{xpForNextLevel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Strength:</span>
          <span className="text-yellow-500">{stats.strength}</span>
        </div>
      </div>
    </div>
  );
}