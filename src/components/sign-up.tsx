import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `${username}@fake-email.com`,
        password,
        options: {
          data: { username },
        },
      });
      if (error) {
        console.error('Signup error:', error);
        setError(error.message || 'An error occurred during sign up');
      } else if (data.user) {
        console.log('User signed up:', data.user);
        
        // Create profile
        const { error: profileError } = await supabase
          .from('Profile')
          .insert({ id: data.user.id, username });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
          setError('Account created, but there was an issue setting up your profile.');
        } else {
          // Create initial stats
          const { error: statsError } = await supabase
            .from('Stats')
            .insert({
              profileId: data.user.id,
              level: 1,
              health: 100,
              experience: 0,
              strength: 10,
              updatedAt: new Date().toISOString()
            });

          if (statsError) {
            console.error('Stats creation error:', statsError);
            console.error('Stats creation error details:', JSON.stringify(statsError, null, 2));
            setError(`Account and profile created, but there was an issue setting up your initial stats: ${statsError.message}`);
          } else {
            router.push(`/dashboard?name=${encodeURIComponent(username)}`);
          }
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error during signup:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-4">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your Name"
                  required
                  title=""
                  className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Username</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secret Incantation"
                  required
                  title=""
                  className="mt-1 block w-full rounded-md border-2 border-black shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Password</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <button type="submit" className="w-full text-black py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Start your journey!
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </TooltipProvider>
  );
}