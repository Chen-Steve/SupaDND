import { useState } from 'react';
import { useRouter } from 'next/router';
import SignUp from '../components/sign-up';
import SignIn from '../components/sign-in';
import { IoMdArrowRoundBack } from "react-icons/io";
import DotBackground from '../components/ui/dots-background';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const router = useRouter();

  const handleGoBack = (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
  };

  return (
    <DotBackground>
      <div className="min-h-screen flex items-center justify-center p-4 overflow-x-auto">
        <div className="flex space-x-8 px-4">
          <button 
            aria-label="Go back"
            onClick={handleGoBack}
            className="text-black border-2 border-black rounded-md hover:text-gray-800 text-4xl absolute top-8 left-8 flex items-center"
          >
            <IoMdArrowRoundBack/>
          </button>
          
          <div className="bg-white rounded-lg shadow-xl p-4 w-[22rem] max-w-full min-h-[26rem] flex flex-col">
            <h1 className="text-lg font-bold text-center mb-3">Hello Wanderer</h1>
            
            <div className="flex mb-3">
              <button
                className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'signup' ? 'bg-black text-white' : 'bg-gray-200 text-black'} rounded-l-md transition-colors`}
                onClick={() => setActiveTab('signup')}
              >
                Starting..
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'signin' ? 'bg-black text-white' : 'bg-gray-200 text-black'} rounded-r-md transition-colors`}
                onClick={() => setActiveTab('signin')}
              >
                Returning..
              </button>
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
              {activeTab === 'signup' ? <SignUp /> : <SignIn />}
            </div>
            
          </div>
        </div>
      </div>
    </DotBackground>
  );
}