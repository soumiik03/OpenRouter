"use client";

import React, { useState } from "react";
import { Link } from "react-router";
import { Copy, ArrowRight } from "lucide-react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { SetuLogo } from "@/components/ui/setu-logo";

export function Landing() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("curl http://localhost:3000/chat/completions");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col justify-between overflow-hidden relative select-none font-sans">
      <StarsBackground
        starDensity={0.00015}
        allStarsTwinkle={true}
        twinkleProbability={0.6}
        minTwinkleSpeed={0.5}
        maxTwinkleSpeed={1.2}
        className="opacity-60 pointer-events-none"
      />
      <ShootingStars
        starColor="#ffffff"
        trailColor="rgba(255, 255, 255, 0.25)"
        minSpeed={18}
        maxSpeed={38}
        minDelay={1500}
        maxDelay={4500}
        starWidth={14}
        starHeight={1}
        className="pointer-events-none"
      />

      <header className="relative z-10 h-16 px-6 sm:px-10 border-b border-zinc-800 bg-black/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1 border border-zinc-800 bg-zinc-950 group-hover:border-zinc-700 transition-colors flex items-center justify-center">
              <SetuLogo size={20} className="text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                SETU
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-l border-zinc-800 pl-2 hidden sm:inline">
                AI BRIDGE
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          <Link
            to="/signin"
            className="text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 transition-colors uppercase text-[11px]"
          >
            Sign In
          </Link>

          <Link to="/dashboard">
            <button className="h-8 px-4 bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white transition-colors cursor-pointer">
              <span>Console</span>
              <ArrowRight className="size-3" />
            </button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto px-6 py-4">
        <div className="px-3 py-1 border border-zinc-800 bg-zinc-950 text-[11px] font-mono text-zinc-400 tracking-wider uppercase mb-6 flex items-center gap-2">
          <span className="size-1.5 bg-white" />
          <span>UNIFIED ROUTING INFRASTRUCTURE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white uppercase font-['Space_Grotesk'] leading-[1.05] max-w-4xl">
          Bridge any application <br />
          <span className="text-zinc-300 font-light">to every frontier model.</span>
        </h1>

        <p className="mt-5 text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-mono leading-relaxed">
          A single endpoint for Claude, GPT, Llama, and 100+ LLMs. Zero markup. Sub-millisecond routing cascades.
        </p>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-lg">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-11 px-6 bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 border border-white transition-all cursor-pointer">
              <span>LAUNCH CONSOLE</span>
              <ArrowRight className="size-3.5" />
            </button>
          </Link>

          <div className="flex items-center justify-between w-full sm:w-auto border border-zinc-800 bg-zinc-950 h-11 px-3.5 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-zinc-600 select-none">$</span>
              <span className="text-zinc-300 font-mono">curl /chat/completions</span>
            </div>
            <button
              onClick={handleCopy}
              className="ml-3 text-zinc-500 hover:text-white p-1 transition-colors cursor-pointer shrink-0 font-mono"
              title="Copy endpoint"
            >
              {copied ? (
                <span className="text-[10px] text-white uppercase font-bold">COPIED</span>
              ) : (
                <Copy className="size-3.5 text-zinc-400" />
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 h-14 px-6 sm:px-10 border-t border-zinc-800 bg-black/90 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
        <div className="flex items-center gap-2">
          <SetuLogo size={16} className="text-white" />
          <span className="text-white font-bold tracking-wider font-['Space_Grotesk'] text-sm">
            SETU
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <Link to="/signin" className="hover:text-white transition-colors">
            Terms
          </Link>
          <Link to="/signin" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span className="text-zinc-600">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
