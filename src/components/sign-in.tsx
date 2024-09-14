import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useRouter } from 'next/router';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@fake-email.com`,
      password,
    });
    if (error) setError(error.message);
    else if (data.user) {
      console.log('User signed in:', data.user);
      router.push('/dashboard');
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSignIn} className="space-y-4">
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
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Return to your journey!
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </TooltipProvider>
  );
}