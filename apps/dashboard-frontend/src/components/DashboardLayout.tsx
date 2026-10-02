import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  Key, 
  CreditCard, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Plus,
  Sun,
  Moon
} from "lucide-react";
import { useProfile, useSignOut } from "@/lib/api";
import { useTheme } from "@/lib/theme";
import { SetuLogo } from "@/components/ui/setu-logo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profile, isLoading } = useProfile();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "API Keys",
      path: "/apikeys",
      icon: Key,
    },
    {
      name: "Credits & Billing",
      path: "/credits",
      icon: CreditCard,
    },
  ];

  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
    } catch {
      document.cookie = "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      navigate("/signin");
    }
  };

  const isActive = (path: string) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  const currentSection = location.pathname.replace("/", "") || "dashboard";

  return (
    <div className="min-h-screen bg-[#f4f4f5] dark:bg-black text-zinc-900 dark:text-white flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      <header className="md:hidden flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="p-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center">
            <SetuLogo size={16} className="text-zinc-900 dark:text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
            SETU
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-950 transition-colors rounded-none"
          >
            {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </button>
          <Link 
            to="/credits" 
            className="px-2.5 py-1 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 rounded-none"
          >
            {(profile?.credits ?? 1000).toLocaleString()} cr
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-950 transition-colors rounded-none"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      <aside className={`
        ${mobileMenuOpen ? "flex" : "hidden"} 
        md:flex flex-col w-full md:w-60 border-r border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black shrink-0 z-40 fixed md:sticky top-0 h-auto md:h-screen
      `}>
        <div className="h-14 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-black">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 transition-colors flex items-center justify-center">
              <SetuLogo size={16} className="text-zinc-950 dark:text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
                SETU
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium tracking-normal transition-all rounded-none
                  ${active 
                    ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white border border-zinc-300 dark:border-zinc-700/80 shadow-2xs font-semibold" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-900/40 border border-transparent"
                  }
                `}
              >
                <Icon className={`size-4 transition-colors ${
                  active 
                    ? "text-zinc-950 dark:text-white stroke-[2.25]" 
                    : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-900">
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-950 transition-colors border border-transparent rounded-none"
            >
              <span>Homepage</span>
              <ExternalLink className="size-3 text-zinc-400" />
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black mb-2.5 rounded-none">
            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <span>Balance</span>
            </div>
            <div className="flex items-baseline justify-between mt-1.5 font-mono">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
                  {isLoading ? "..." : (profile?.credits ?? 1000).toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase">cr</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                ${((profile?.credits ?? 1000) / 1000).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="size-7 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 rounded-none border border-zinc-300 dark:border-zinc-700">
                {profile?.email ? profile.email.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="truncate text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                {profile?.email || "Account"}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors rounded-none cursor-pointer"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f4f4f5] dark:bg-black">
        <div className="hidden md:flex items-center justify-between px-8 h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/90 backdrop-blur-xs sticky top-0 z-30">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <span className="text-zinc-900 dark:text-white capitalize font-semibold">
              {currentSection === "apikeys" ? "API Keys" : currentSection === "credits" ? "Credits & Billing" : "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="h-8 px-2.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-xs flex items-center gap-1.5 rounded-none cursor-pointer transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="size-3.5 text-zinc-300" />
                  <span className="text-[11px] uppercase">Light</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-zinc-700" />
                  <span className="text-[11px] uppercase">Dark</span>
                </>
              )}
            </button>

            <Link
              to="/credits"
              className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors rounded-none flex items-center gap-2"
            >
              <span className="text-zinc-400">Balance:</span>
              <strong className="text-zinc-950 dark:text-white font-mono font-bold">
                {isLoading ? "..." : (profile?.credits ?? 1000).toLocaleString()} cr
              </strong>
            </Link>

            <Link to="/apikeys">
              <button className="h-8 px-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-zinc-900 dark:border-white transition-colors rounded-none cursor-pointer">
                <Plus className="size-3.5 stroke-[2.5]" />
                <span>New Key</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
