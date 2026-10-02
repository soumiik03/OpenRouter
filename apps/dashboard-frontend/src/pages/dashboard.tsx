import React from "react";
import { Link } from "react-router";
import { ArrowRight, Plus, CreditCard } from "lucide-react";
import { useProfile, useApiKeys } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

export function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: keysData, isLoading: keysLoading } = useApiKeys();

  const apiKeys = keysData?.apiKeys || profile?.apiKeys || [];
  const activeKeysCount = apiKeys.filter((k) => !k.disabled && !k.deleted).length;
  const totalCreditsConsumed = apiKeys.reduce(
    (acc, k) => acc + (k.creditsConsumed ?? k.credisConsumed ?? 0),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              Overview
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
              Manage your gateway balance, keys, and usage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/credits">
              <button className="h-8 px-3.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-mono uppercase text-zinc-700 dark:text-zinc-300 rounded-none transition-colors cursor-pointer flex items-center gap-1.5">
                <CreditCard className="size-3 text-zinc-400" />
                <span>Add Credits</span>
              </button>
            </Link>
            <Link to="/apikeys">
              <button className="h-8 px-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center gap-1.5">
                <Plus className="size-3.5 stroke-[2.5]" />
                <span>New API Key</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              Available Credits
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white tracking-tight mt-1.5">
              {profileLoading ? "..." : (profile?.credits ?? 1000).toLocaleString()}
            </div>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              ~${((profile?.credits ?? 1000) / 1000).toFixed(2)} USD
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              Active API Keys
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white tracking-tight mt-1.5">
              {keysLoading ? "..." : activeKeysCount}
            </div>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              {apiKeys.length} {apiKeys.length === 1 ? "total key" : "total keys"}
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              Credits Consumed
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white tracking-tight mt-1.5">
              {keysLoading ? "..." : totalCreditsConsumed.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              Total usage across keys
            </div>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-black">
            <h2 className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
              Your API Keys
            </h2>
            <Link 
              to="/apikeys" 
              className="text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Manage keys</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {apiKeys.length === 0 ? (
            <div className="p-10 text-center font-mono text-xs text-zinc-500">
              No API keys created yet.
              <div className="mt-3">
                <Link to="/apikeys">
                  <button className="h-8 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-mono font-bold uppercase rounded-none cursor-pointer">
                    Create API Key
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">NAME</th>
                  <th className="py-2.5 px-4 font-medium">TOKEN</th>
                  <th className="py-2.5 px-4 font-medium">USAGE</th>
                  <th className="py-2.5 px-4 text-right font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                {apiKeys.slice(0, 5).map((key) => {
                  const usage = (key.creditsConsumed ?? key.credisConsumed ?? 0);
                  return (
                    <tr key={key.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-zinc-950 dark:text-white">{key.name}</td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                        <span className="px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-300">
                          {key.apiKey ? `${key.apiKey.slice(0, 10)}••••••••` : "sk-or-v1-••••••••"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {usage.toLocaleString()} cr
                      </td>
                      <td className="py-3 px-4 text-right">
                        {key.disabled ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-[10px] uppercase font-mono rounded-none">
                            <span className="size-1.5 bg-zinc-400 dark:bg-zinc-600" />
                            Disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-mono rounded-none">
                            <span className="size-1.5 bg-emerald-500 dark:bg-emerald-400" />
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
