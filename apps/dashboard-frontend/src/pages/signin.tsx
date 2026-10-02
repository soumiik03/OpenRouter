import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useSignIn } from "@/lib/api";
import { SetuLogo } from "@/components/ui/setu-logo";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signInMutation = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      await signInMutation.mutateAsync({ email: cleanEmail, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "Invalid credentials.");
      } else {
        setErrorMessage("An error occurred during sign in.");
      }
    }
  };

  const handleDemoFill = () => {
    setEmail("sou@123.com");
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-mono select-none selection:bg-white selection:text-black">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="p-1 border border-zinc-800 bg-zinc-950 group-hover:border-zinc-600 transition-colors flex items-center justify-center rounded-none">
              <SetuLogo size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
              SETU
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk'] uppercase mt-1">
            Sign In
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Access your gateway account and API keys.</p>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 p-2.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-none">
              <AlertCircle className="size-3.5 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] uppercase tracking-wider text-zinc-400 block font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="developer@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full h-9 border border-zinc-800 bg-black text-xs text-white placeholder:text-zinc-600 font-mono px-3 rounded-none focus:border-white focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] uppercase tracking-wider text-zinc-400 block font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider cursor-pointer"
                >
                  Quick Demo
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-9 border border-zinc-800 bg-black text-xs text-white placeholder:text-zinc-600 font-mono px-3 rounded-none focus:border-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="w-full h-10 mt-2 bg-white text-black hover:bg-zinc-200 border border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {signInMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Console</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-900 text-center">
            <p className="text-xs text-zinc-500 font-mono">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white font-bold hover:underline ml-1">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-wider">
            &larr; Return to gateway homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
