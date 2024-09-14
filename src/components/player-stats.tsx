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

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats found</div>;

  const xpForNextLevel = calculateXpForNextLevel(stats.level);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-red-500">Level: {stats.level}</p>
          <p className="font-semibold text-green-500">Health: {stats.health}</p>
        </div>
        <div>
          <p className="font-semibold text-blue-500">XP: {stats.experience}/{xpForNextLevel}</p>
          <p className="font-semibold text-yellow-500">Strength: {stats.strength}</p>
        </div>
      </div>
    </div>
  );
}