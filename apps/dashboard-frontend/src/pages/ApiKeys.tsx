import React, { useState } from "react";
import { 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Loader2, 
  Search, 
  X, 
  Key 
} from "lucide-react";
import { 
  useApiKeys, 
  useCreateApiKey, 
  useUpdateApiKey, 
  useDeleteApiKey,
  type ApiKey 
} from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

export function ApiKeys() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<number | string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: keysData, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const updateMutation = useUpdateApiKey();
  const deleteMutation = useDeleteApiKey();

  const apiKeys = keysData?.apiKeys || [];

  const filteredKeys = apiKeys.filter((k) => 
    !k.deleted && 
    (k.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     k.apiKey?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const newKey = await createMutation.mutateAsync({ name: newKeyName.trim() });
      setCreatedKey(newKey);
      setNewKeyName("");
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Failed to create key:", err);
    }
  };

  const handleToggleDisabled = async (key: ApiKey) => {
    try {
      await updateMutation.mutateAsync({
        id: key.id,
        disabled: !key.disabled,
      });
    } catch (err) {
      console.error("Failed to toggle key status:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete key:", err);
    }
  };

  const copyToClipboard = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
              API Keys
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
              Create and manage secret API keys to authenticate your requests.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Create New Key</span>
          </button>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="size-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search API keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 h-9 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-mono rounded-none focus:border-zinc-400 dark:focus:border-white focus:outline-hidden"
          />
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-black">
            <h2 className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
              All Keys
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {filteredKeys.length} {filteredKeys.length === 1 ? "key" : "keys"}
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-xs text-zinc-500 font-mono">
              <Loader2 className="size-5 animate-spin mx-auto mb-2 text-zinc-400" />
              Loading API keys...
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500 font-mono">
              <Key className="size-6 mx-auto mb-2 text-zinc-400 dark:text-zinc-600" />
              {searchQuery ? "No matching API keys found." : "No API keys generated yet."}
              {!searchQuery && (
                <div className="mt-3">
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="h-8 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-mono font-bold uppercase rounded-none cursor-pointer"
                  >
                    Create First Key
                  </button>
                </div>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">NAME</th>
                  <th className="py-2.5 px-4 font-medium">SECRET KEY</th>
                  <th className="py-2.5 px-4 font-medium">USAGE</th>
                  <th className="py-2.5 px-4 font-medium">STATUS</th>
                  <th className="py-2.5 px-4 text-right font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                {filteredKeys.map((key) => {
                  const isCopied = copiedKeyId === key.id;
                  const usage = (key.creditsConsumed ?? key.credisConsumed ?? 0);
                  return (
                    <tr key={key.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-zinc-950 dark:text-white">{key.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2 px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-300">
                          <span>{key.apiKey ? `${key.apiKey.slice(0, 10)}••••••••` : "sk-or-v1-••••••••"}</span>
                          <button
                            onClick={() => copyToClipboard(key.apiKey, key.id)}
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                            title="Copy key"
                          >
                            {isCopied ? <Check className="size-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3" />}
                          </button>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {usage.toLocaleString()} cr
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleDisabled(key)}
                          className={`text-[10px] px-2 py-0.5 border uppercase rounded-none transition-colors cursor-pointer ${
                            key.disabled
                              ? "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                              : "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                          }`}
                        >
                          {key.disabled ? "Disabled" : "Active"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setDeleteConfirmId(key.id)}
                          className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors cursor-pointer rounded-none"
                          title="Revoke key"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
            <div className="w-full max-w-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-none shadow-xl relative font-mono">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>

              <h2 className="text-base font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Create API Key
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Enter a descriptive name for your key.
              </p>

              <form onSubmit={handleCreate} className="space-y-4 mt-5">
                <div className="space-y-1.5">
                  <label htmlFor="key-name" className="text-xs text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                    Key Name
                  </label>
                  <input
                    id="key-name"
                    type="text"
                    placeholder="e.g. Production Backend"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                    autoFocus
                    className="w-full h-9 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-mono px-3 rounded-none focus:border-zinc-400 dark:focus:border-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="h-8 px-3 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || !newKeyName.trim()}
                    className="h-8 px-4 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Key"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {createdKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
            <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-none shadow-xl font-mono">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Save Your Secret Key
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Copy this key immediately and store it securely. For security reasons, it cannot be revealed again.
              </p>

              <div className="mt-4 flex items-center gap-2 p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black font-mono text-xs rounded-none">
                <span className="flex-1 select-all break-all text-emerald-700 dark:text-emerald-400 font-mono">
                  {createdKey.apiKey}
                </span>
                <button
                  onClick={() => copyToClipboard(createdKey.apiKey, "new-key")}
                  className="h-7 px-3 text-xs bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white font-mono font-bold uppercase shrink-0 gap-1 rounded-none flex items-center cursor-pointer"
                >
                  {copiedKeyId === "new-key" ? <Check className="size-3 text-white dark:text-black" /> : <Copy className="size-3" />}
                  <span>{copiedKeyId === "new-key" ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setCreatedKey(null)}
                  className="h-8 px-5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4">
            <div className="w-full max-w-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 rounded-none shadow-xl font-mono">
              <h2 className="text-sm font-bold text-zinc-950 dark:text-white font-['Space_Grotesk']">
                Revoke API Key?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Any application using this token will immediately fail with a 403 unauthorized error.
              </p>
              <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="h-8 px-3 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="h-8 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase rounded-none border border-red-500 cursor-pointer"
                >
                  {deleteMutation.isPending ? "Revoking..." : "Revoke Key"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ApiKeys;
