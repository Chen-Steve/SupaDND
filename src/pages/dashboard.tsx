import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiSettings } from "react-icons/fi";
import { TbGradienter } from "react-icons/tb";
import SettingsModal from "../components/settings-modal";
import PlayerStats from "../components/player-stats";
import ChatMessage from "../components/chat-message";
import { supabase } from '../lib/supabaseClient';

type Stats = {
  level: number;
  health: number;
  experience: number;
  strength: number;
};

export default function Welcome() {
  const router = useRouter();
  const { name } = router.query;
  const [inputValue, setInputValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<{ message: string, isUser: boolean, timestamp: string }[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [welcomeMessageVisible, setWelcomeMessageVisible] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('Profile')
            .select('username')
            .eq('id', user.id)
            .single();
          if (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load user profile');
          } else if (data) {
            setUsername(data.username);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      }
    };
    fetchUsername();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUsername(null);
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  const handleUpdateName = async (newName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('Profile')
        .update({ username: newName })
        .eq('id', user.id);

      if (error) throw error;

      setUsername(newName);
    } catch (err) {
      console.error('Error updating name:', err);
      setError('Failed to update name');
      throw err;
    }
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    const currentTime = new Date().toLocaleTimeString();
    setMessages([...messages, { message: inputValue, isUser: true, timestamp: currentTime }]);
    setInputValue("");
    setError(""); // Clear any existing error
    setWelcomeMessageVisible(false); // Hide welcome message

    try {
      const res = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue }),
      });

      const data = await res.json();
      if (res.ok) {
        const aiResponseTime = new Date().toLocaleTimeString();
        setMessages(prevMessages => [
          ...prevMessages,
          { message: data.message, isUser: false, timestamp: aiResponseTime }
        ]);

        // Update stats based on the AI response
        if (stats) {
          const newStats = {
            ...stats,
            experience: stats.experience + 10, // Example: gain 10 XP per interaction
          };
          updateStats(newStats);
        }
      } else {
        setError(data.error || 'Failed to generate response');
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
      setError('Failed to generate response');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const updateStats = useCallback(async (newStats: Stats) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is authenticated, update stats in Supabase
        const { error } = await supabase
          .from('Stats')
          .update(newStats)
          .eq('profileId', user.id);

        if (error) throw error;
      } else {
        // User is not authenticated, update stats in local storage
        localStorage.setItem('playerStats', JSON.stringify(newStats));
      }
      setStats(newStats);
    } catch (err) {
      console.error('Error updating stats:', err);
      setError('Failed to update stats');
    }
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-8">
        <Link href="/" className="text-black border-2 border-black rounded-md hover:text-gray-800 text-4xl flex items-center">
          <IoMdArrowRoundBack/>
        </Link>
        <button
          aria-label="Settings"
          onClick={() => setIsSettingsOpen(true)}
          className="text-black hover:text-gray-800"
        >
          <FiSettings className="text-4xl" />
        </button>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-start pt-2 px-4 overflow-hidden">
        <main className="w-full max-w-2xl text-center mb-4">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            welcomeMessageVisible && (
              <p className="text-2xl mb-4">Welcome, <span className="font-bold">{username || name || 'Adventurer'}</span>!</p>
            )
          )}
        </main>
        
        <div className="w-full max-w-2xl mb-4 flex flex-col space-y-2 overflow-y-auto flex-grow h-4/5">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.message} isUser={msg.isUser} timestamp={msg.timestamp} />
          ))}
        </div>

        <div className="w-full max-w-2xl mb-4 flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-grow px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            aria-label="Submit"
            onClick={handleInputSubmit}
            className="px-2 py-2 bg-black text-white rounded-md flex items-center justify-center group"
          >
            <TbGradienter className="text-3xl transition-transform duration-300 group-hover:rotate-180" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl p-4 bg-white mx-auto flex justify-center">
        <PlayerStats />
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        username={username} 
        onSignOut={handleSignOut}
        onUpdateName={handleUpdateName}
      />
    </div>
  );
}