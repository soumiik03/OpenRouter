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
  Plus
} from "lucide-react";
import { useProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profile, isLoading } = useProfile();

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

  const handleSignOut = () => {
    document.cookie = "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    navigate("/signin");
  };

  const isActive = (path: string) => {
    return location.pathname.toLowerCase() === path.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-5 py-3.5 border-b border-zinc-200/80 bg-white sticky top-0 z-50">
        <Link to="/dashboard" className="font-semibold text-sm tracking-tight text-zinc-950">
          OpenRouter
        </Link>
        <div className="flex items-center gap-3">
          <Link 
            to="/credits" 
            className="px-2.5 py-1 rounded-md border border-zinc-200 text-xs font-mono text-zinc-700 bg-zinc-50"
          >
            {(profile?.credits ?? 1000).toLocaleString()} cr
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`
        ${mobileMenuOpen ? "flex" : "hidden"} 
        md:flex flex-col w-full md:w-56 border-r border-zinc-200/80 bg-zinc-50/50 shrink-0 z-40 fixed md:sticky top-0 h-auto md:h-screen
      `}>
        {/* Brand Text Header (No Logo) */}
        <div className="h-14 px-5 border-b border-zinc-200/80 flex items-center justify-between">
          <Link to="/dashboard" className="font-semibold text-sm tracking-tight text-zinc-950 hover:opacity-80 transition-opacity">
            OpenRouter
          </Link>
        </div>

        {/* Navigation list */}
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
                  flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors
                  ${active 
                    ? "bg-zinc-200/70 text-zinc-950 font-medium" 
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60"
                  }
                `}
              >
                <Icon className={`size-3.5 ${active ? "text-zinc-950" : "text-zinc-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-zinc-200/60">
            <Link
              to="/"
              className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60 transition-colors"
            >
              <span>Homepage</span>
              <ExternalLink className="size-3 text-zinc-400" />
            </Link>
          </div>
        </nav>

        {/* User Account / Footer */}
        <div className="p-3 border-t border-zinc-200/80 bg-white">
          <div className="p-2.5 rounded-md border border-zinc-200/80 bg-zinc-50/60 mb-2">
            <div className="text-[11px] text-zinc-500">Balance</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-semibold font-mono text-zinc-950">
                {isLoading ? "..." : (profile?.credits ?? 1000).toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">credits</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="size-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-[10px] font-medium shrink-0">
                {profile?.email ? profile.email.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="truncate text-xs text-zinc-700 font-medium">
                {profile?.email || "Account"}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="text-zinc-400 hover:text-zinc-900 p-1 rounded-md hover:bg-zinc-100 transition-colors"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Desktop Top Header */}
        <div className="hidden md:flex items-center justify-between px-8 h-14 border-b border-zinc-200/80 bg-white sticky top-0 z-30">
          <div className="text-xs text-zinc-400 font-mono">
            gateway / <span className="text-zinc-800 capitalize font-medium">{location.pathname.replace("/", "") || "dashboard"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/credits"
              className="px-2.5 py-1 rounded-md border border-zinc-200 text-xs font-mono text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition-colors"
            >
              Balance: <strong className="text-zinc-950 font-semibold">{isLoading ? "..." : (profile?.credits ?? 1000).toLocaleString()}</strong>
            </Link>

            <Link to="/apikeys">
              <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-8 px-3 rounded-md gap-1.5 shadow-none font-medium">
                <Plus className="size-3.5" />
                <span>New Key</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Page Container */}
        <div className="flex-1 p-6 md:p-8 max-w-4xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
