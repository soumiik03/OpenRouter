import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useSignUp } from "@/lib/api";
import { SetuLogo } from "@/components/ui/setu-logo";

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signUpMutation = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      await signUpMutation.mutateAsync({ email: cleanEmail, password });
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "Failed to create account. Email may already be in use.");
      } else {
        setErrorMessage("An unexpected error occurred during signup.");
      }
    }
  };

  const isSubmitting = signUpMutation.isPending;

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
            Create Account
          </h1>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 border border-zinc-800 bg-zinc-950 text-[11px] text-zinc-300 rounded-none">
            <span className="size-1.5 bg-emerald-400" />
            <span>Includes 1,000 Free Starter Credits</span>
          </div>
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
              <label htmlFor="signup-email" className="text-[11px] uppercase tracking-wider text-zinc-400 block font-medium">
                Email Address
              </label>
              <input
                id="signup-email"
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
                <label htmlFor="signup-password" className="text-[11px] uppercase tracking-wider text-zinc-400 block font-medium">
                  Password
                </label>
                <span className="text-[10px] text-zinc-600 uppercase">Min. 6 chars</span>
              </div>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-9 border border-zinc-800 bg-black text-xs text-white placeholder:text-zinc-600 font-mono px-3 rounded-none focus:border-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 bg-white text-black hover:bg-zinc-200 border border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>INITIALIZING ACCOUNT...</span>
                </>
              ) : (
                <>
                  <span>Initialize & Launch Console</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-900 text-center">
            <p className="text-xs text-zinc-500 font-mono">
              Already registered?{" "}
              <Link to="/signin" className="text-white font-bold hover:underline ml-1">
                SIGN IN
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

export default SignUp;
