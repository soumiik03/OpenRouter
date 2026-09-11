import React, { useState } from "react";
import { Link } from "react-router";
import { Copy, Check, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Landing() {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<"typescript" | "python" | "curl">("typescript");
  const [searchQuery, setSearchQuery] = useState("");

  const defaultModels = [
    { name: "Claude 3.5 Sonnet", slug: "anthropic/claude-3-5-sonnet", provider: "Anthropic", input: "$3.00", output: "$15.00", context: "200k" },
    { name: "GPT-4o", slug: "openai/gpt-4o", provider: "OpenAI", input: "$2.50", output: "$10.00", context: "128k" },
    { name: "Gemini 1.5 Pro", slug: "google/gemini-1.5-pro", provider: "Google", input: "$1.25", output: "$5.00", context: "2M" },
    { name: "Llama 3.3 70B", slug: "meta/llama-3.3-70b", provider: "Meta", input: "$0.40", output: "$0.40", context: "128k" },
    { name: "DeepSeek V3", slug: "deepseek/deepseek-chat", provider: "DeepSeek", input: "$0.14", output: "$0.28", context: "64k" },
  ];

  const codeSnippets = {
    typescript: `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:3000",
  apiKey: "sk-or-v1-YOUR-KEY",
});

const completion = await client.chat.completions.create({
  model: "anthropic/claude-3-5-sonnet",
  messages: [{ role: "user", content: "Hello OpenRouter!" }],
});

console.log(completion.choices[0].message.content);`,

    python: `from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3000",
    api_key="sk-or-v1-YOUR-KEY"
)

response = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[{"role": "user", "content": "Hello OpenRouter!"}]
)

print(response.choices[0].message.content)`,

    curl: `curl http://localhost:3000/chat/completions \\
  -H "Authorization: Bearer sk-or-v1-YOUR-KEY" \\
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

  const filteredModels = defaultModels.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-200/80 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-sm tracking-tight text-zinc-950 hover:opacity-80 transition-opacity">
            OpenRouter
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-xs text-zinc-600">
            <a href="#quickstart" className="hover:text-zinc-950 transition-colors">Quickstart</a>
            <a href="#models" className="hover:text-zinc-950 transition-colors">Models</a>
            <Link to="/Credits" className="hover:text-zinc-950 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="text-xs h-8 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70 font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-xs h-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium px-3 shadow-xs">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.15]">
          Unified API Gateway for LLMs
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-600 max-w-lg mx-auto leading-relaxed">
          One API key for OpenAI, Anthropic, Gemini, and open-source models. Standard OpenAI SDK compatible with zero price markup.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/signup">
            <Button size="lg" className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-md gap-1.5 shadow-xs">
              <span>Start Free</span>
              <ArrowRight className="size-3" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="h-9 px-4 border-zinc-200 text-zinc-800 hover:bg-zinc-50 text-xs font-medium rounded-md">
              Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Code Snippet */}
      <section id="quickstart" className="py-8 px-6 max-w-3xl mx-auto">
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-xs">
          <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-50 border-b border-zinc-200 text-xs">
            <div className="flex items-center gap-1">
              {(["typescript", "python", "curl"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded capitalize font-mono text-xs transition-colors ${
                    language === lang
                      ? "bg-white text-zinc-950 border border-zinc-200/80 font-medium shadow-2xs"
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
              className="h-6 px-2 text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50 gap-1 bg-white"
            >
              {copied ? <Check className="size-3 text-zinc-950" /> : <Copy className="size-3 text-zinc-500" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>

          <div className="p-4 bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>
              <code>{codeSnippets[language]}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Models Table */}
      <section id="models" className="py-12 px-6 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Supported Models</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Rates per 1 million tokens.</p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="size-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 border border-zinc-200 rounded-md text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>

        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono uppercase">
              <tr>
                <th className="py-2.5 px-3.5">Model</th>
                <th className="py-2.5 px-3.5">Provider</th>
                <th className="py-2.5 px-3.5">Input / 1M</th>
                <th className="py-2.5 px-3.5">Output / 1M</th>
                <th className="py-2.5 px-3.5">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              {filteredModels.map((m) => (
                <tr key={m.slug} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-3.5 font-medium text-zinc-950">
                    <div>{m.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{m.slug}</div>
                  </td>
                  <td className="py-2.5 px-3.5 text-zinc-600">{m.provider}</td>
                  <td className="py-2.5 px-3.5 font-mono text-zinc-700">{m.input}</td>
                  <td className="py-2.5 px-3.5 font-mono text-zinc-700">{m.output}</td>
                  <td className="py-2.5 px-3.5 font-mono text-zinc-500">{m.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200/80 py-8 px-6 text-center text-xs text-zinc-400">
        <p>&copy; {new Date().getFullYear()} OpenRouter.</p>
      </footer>
    </div>
  );
}

export default Landing;
