import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSignUp, useSignIn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await signUpMutation.mutateAsync({ email, password });
      try {
        await signInMutation.mutateAsync({ email, password });
        navigate("/dashboard");
      } catch {
        navigate("/signin");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message || "Failed to create account. Email may already be in use.");
      } else {
        setErrorMessage("An error occurred during signup.");
      }
    }
  };

  const isSubmitting = signUpMutation.isPending || signInMutation.isPending;

  return (
    <div className="min-h-screen bg-zinc-50/60 flex flex-col justify-center items-center px-4 font-sans text-zinc-900">
      <div className="w-full max-w-sm">
        {/* Brand Text Header (No logo icon) */}
        <div className="mb-6 text-center">
          <Link to="/" className="font-semibold text-sm tracking-tight text-zinc-950 hover:opacity-80 transition-opacity">
            OpenRouter
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 mt-3">Create account</h1>
          <p className="text-xs text-zinc-500 mt-1">Get 1,000 free starter credits upon registration.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xs">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="size-3.5 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signup-email" className="text-xs font-medium text-zinc-700">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-zinc-200 text-xs text-zinc-900 h-8 rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="signup-password" className="text-xs font-medium text-zinc-700">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-zinc-200 text-xs text-zinc-900 h-8 rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-medium text-zinc-700">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white border-zinc-200 text-xs text-zinc-900 h-8 rounded-md"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-8 rounded-md shadow-none font-medium mt-1"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin mx-auto" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Already have an account?{" "}
              <Link to="/signin" className="text-zinc-900 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-zinc-400 hover:text-zinc-600">
            &larr; Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export const signup = SignUp;
export default SignUp;
