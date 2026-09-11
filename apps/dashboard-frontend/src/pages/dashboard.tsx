import React, { useState } from "react";
import { Link } from "react-router";
import { 
  Copy, 
  Check, 
  ArrowRight
} from "lucide-react";
import { useProfile, useApiKeys } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"typescript" | "python" | "curl">("typescript");

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: keysData, isLoading: keysLoading } = useApiKeys();

  const apiKeys = keysData?.apiKeys || profile?.apiKeys || [];
  const activeKeysCount = apiKeys.filter((k) => !k.disabled && !k.deleted).length;
  const totalCreditsConsumed = apiKeys.reduce((acc, k) => acc + (k.creditsConsumed || 0), 0);

  const activeKeySample = apiKeys.find((k) => !k.disabled && !k.deleted)?.apiKey || "sk-or-v1-YOUR-KEY";

  const codeSnippets = {
    typescript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:3000",
  apiKey: "${activeKeySample}",
});

const response = await client.chat.completions.create({
  model: "anthropic/claude-3-5-sonnet",
  messages: [{ role: "user", content: "Hello OpenRouter!" }],
});

console.log(response.choices[0].message.content);`,

    python: `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3000",
    api_key="${activeKeySample}"
)

response = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[{"role": "user", "content": "Hello OpenRouter!"}]
)

print(response.choices[0].message.content)`,

    curl: `curl http://localhost:3000/chat/completions \\
  -H "Authorization: Bearer ${activeKeySample}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "anthropic/claude-3-5-sonnet",
    "messages": [{"role": "user", "content": "Hello OpenRouter!"}]
  }'`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-950">Overview</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Manage your gateway balance and API keys.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/Credits">
              <Button variant="outline" size="sm" className="h-8 text-xs border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 rounded-md font-medium">
                Add Credits
              </Button>
            </Link>
            <Link to="/ApiKeys">
              <Button size="sm" className="h-8 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium shadow-xs">
                New API Key
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-xs text-zinc-500 font-medium">Available Credits</div>
            <div className="text-2xl font-bold font-mono text-zinc-950 mt-1 tracking-tight">
              {profileLoading ? "..." : (profile?.credits ?? 1000).toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">
              ~${((profile?.credits ?? 1000) / 1000).toFixed(2)} USD
            </div>
          </div>

          <div className="p-4 rounded-lg border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-xs text-zinc-500 font-medium">Active API Keys</div>
            <div className="text-2xl font-bold font-mono text-zinc-950 mt-1 tracking-tight">
              {keysLoading ? "..." : activeKeysCount}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {apiKeys.length} total keys
            </div>
          </div>

          <div className="p-4 rounded-lg border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="text-xs text-zinc-500 font-medium">Credits Consumed</div>
            <div className="text-2xl font-bold font-mono text-zinc-950 mt-1 tracking-tight">
              {totalCreditsConsumed.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Total usage across keys
            </div>
          </div>
        </div>

        {/* Quickstart Integration */}
        <div className="border border-zinc-200/80 rounded-lg overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-50/70 border-b border-zinc-200/80 text-xs">
            <span className="font-medium text-zinc-800">Quickstart Integration</span>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {(["typescript", "python", "curl"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded capitalize font-mono text-xs transition-colors ${
                      language === lang
                        ? "bg-white text-zinc-950 border border-zinc-200 font-medium shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 gap-1 rounded"
              >
                {copied ? <Check className="size-3 text-zinc-950" /> : <Copy className="size-3 text-zinc-500" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>
              <code>{codeSnippets[language]}</code>
            </pre>
          </div>
        </div>

        {/* API Keys Table */}
        <div className="border border-zinc-200/80 rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="px-4 py-3 border-b border-zinc-200/80 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-950 uppercase tracking-wider">Your API Keys</h2>
            <Link to="/ApiKeys" className="text-xs text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors">
              Manage keys <ArrowRight className="size-3" />
            </Link>
          </div>

          {apiKeys.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No API keys created yet.
              <div className="mt-2">
                <Link to="/ApiKeys">
                  <Button size="sm" className="h-7 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-md">
                    Create API Key
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Name</th>
                  <th className="py-2.5 px-4 font-medium">Token</th>
                  <th className="py-2.5 px-4 font-medium">Usage</th>
                  <th className="py-2.5 px-4 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {apiKeys.slice(0, 5).map((key) => (
                  <tr key={key.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-zinc-950">{key.name}</td>
                    <td className="py-2.5 px-4 font-mono text-zinc-500">
                      {key.apiKey ? `${key.apiKey.slice(0, 10)}••••••••` : "sk-or-v1-••••••••"}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-zinc-600">
                      {(key.creditsConsumed || 0).toLocaleString()} cr
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={`inline-block size-1.5 rounded-full ${key.disabled ? "bg-zinc-300" : "bg-emerald-500"}`} />
                      <span className="ml-1.5 text-zinc-600 capitalize text-[11px]">
                        {key.disabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export const dashboard = Dashboard;
export default Dashboard;
