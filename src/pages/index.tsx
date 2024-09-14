import Image from "next/image";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { DiGithubBadge } from "react-icons/di";
import FlickeringGrid from "../components/magicui/flickering-grid";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/dashboard?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <FlickeringGrid color="rgb(0, 0, 255)" maxOpacity={0.1}>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            Enter the <span className="text-gradient">SupaDnD!</span>
          </h1>

          <form onSubmit={handleSubmit} className="mt-3">
            <p className="text-2xl flex items-center justify-center">
              Gear up,{' '}
              <input
                type="text"
                maxLength={10}
                placeholder="Your name"
                className="w-40 text-2xl bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 mx-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              !
              <button title="Enter" type="submit" className="ml-2 text-blue-600 hover:text-blue-800">
                <FaSquareArrowUpRight className="inline-block text-2xl" />
              </button>
            </p>
          </form>
        </main>

        <div className="absolute bottom-4 right-4 flex items-center space-x-4">
          <a 
            title="GitHub"
            href="https://github.com/Chen-Steve/SupaDND" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:text-gray-800 transition-colors"
          >
            <DiGithubBadge size={30} />
          </a>
          <a title="Made with Supabase" href="https://supabase.com" rel="noopener noreferrer"> 
            <Image
              src="https://supabase.com/badge-made-with-supabase-dark.svg"
              alt="Made with Supabase"
              width={168}
              height={30}
            />
          </a>
        </div>
      </div>
    </FlickeringGrid>
  );
}