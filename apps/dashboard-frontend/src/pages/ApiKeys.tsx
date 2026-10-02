import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  X,
  Loader2
} from "lucide-react";
import { 
  useApiKeys, 
  useCreateApiKey, 
  useUpdateApiKey, 
  useDeleteApiKey,
  type ApiKey
} from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ApiKeys() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<number | string | null>(null);

  const { data: keysData, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const updateMutation = useUpdateApiKey();
  const deleteMutation = useDeleteApiKey();

  const apiKeys = (keysData?.apiKeys || []).filter((k) => !k.deleted);

  const filteredKeys = apiKeys.filter((k) =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.apiKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const newKey = await createMutation.mutateAsync({ name: newKeyName.trim() });
      setNewKeyName("");
      setIsCreateOpen(false);
      setCreatedKey(newKey);
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
      console.error("Failed to update key:", err);
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-950">API Keys</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Manage secret tokens to authenticate requests.</p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-8 px-3 rounded-md gap-1.5 shadow-xs font-medium"
          >
            <Plus className="size-3.5" />
            <span>Create New Key</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="size-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 h-8 rounded-md"
          />
        </div>

        {/* Table */}
        <div className="border border-zinc-200/80 rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {isLoading ? (
            <div className="py-16 text-center text-xs text-zinc-500">
              <Loader2 className="size-5 animate-spin mx-auto mb-2 text-zinc-400" />
              Loading keys...
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="py-16 text-center text-xs text-zinc-500">
              {searchQuery ? "No matching API keys." : "No API keys created yet."}
              {!searchQuery && (
                <div className="mt-2">
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    size="sm"
                    className="h-7 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-md"
                  >
                    Create a Key
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Key Name</th>
                  <th className="py-2.5 px-4 font-medium">Key Token</th>
                  <th className="py-2.5 px-4 font-medium">Usage</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {filteredKeys.map((key) => {
                  const isCopied = copiedKeyId === key.id;
                  return (
                    <tr key={key.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-zinc-950">{key.name}</td>
                      <td className="py-2.5 px-4 font-mono text-zinc-500">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50/80 text-zinc-700">
                          <span>{key.apiKey ? `${key.apiKey.slice(0, 10)}••••••••` : "sk-or-v1-••••••••"}</span>
                          <button
                            onClick={() => copyToClipboard(key.apiKey, key.id)}
                            className="text-zinc-400 hover:text-zinc-900 transition-colors"
                            title="Copy key"
                          >
                            {isCopied ? <Check className="size-3 text-zinc-950" /> : <Copy className="size-3" />}
                          </button>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-zinc-600">
                        {(key.creditsConsumed || 0).toLocaleString()} cr
                      </td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => handleToggleDisabled(key)}
                          className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                            key.disabled
                              ? "border-zinc-200 bg-zinc-100 text-zinc-500"
                              : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                          }`}
                        >
                          {key.disabled ? "Disabled" : "Active"}
                        </button>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteConfirmId(key.id)}
                          className="text-zinc-400 hover:text-red-600 p-1 rounded-md transition-colors"
                          title="Delete key"
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

        {/* Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-2xs p-4">
            <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-lg relative">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
              >
                <X className="size-4" />
              </button>

              <h2 className="text-sm font-bold text-zinc-950">Create API Key</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Enter a name for this key.</p>

              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <Label htmlFor="key-name" className="text-xs text-zinc-700 font-medium">
                    Name
                  </Label>
                  <Input
                    id="key-name"
                    type="text"
                    placeholder="e.g. Production App"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                    autoFocus
                    className="bg-white border-zinc-200 text-xs text-zinc-900 h-8 rounded-md"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreateOpen(false)}
                    className="h-8 text-xs text-zinc-600 hover:text-zinc-950"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createMutation.isPending || !newKeyName.trim()}
                    className="h-8 bg-zinc-900 hover:bg-zinc-800 text-white text-xs rounded-md font-medium"
                  >
                    {createMutation.isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Secret Key Reveal Modal */}
        {createdKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-2xs p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-lg">
              <h2 className="text-sm font-bold text-zinc-950">Save Your Secret Key</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Please copy this key now. It cannot be shown again.
              </p>

              <div className="mt-4 flex items-center gap-2 p-2 rounded-md border border-zinc-200 bg-zinc-50/80 font-mono text-xs text-zinc-900">
                <span className="flex-1 select-all break-all">{createdKey.apiKey}</span>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(createdKey.apiKey, "new-key")}
                  className="h-7 px-2.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-white shrink-0 gap-1 rounded-md"
                >
                  {copiedKeyId === "new-key" ? <Check className="size-3 text-white" /> : <Copy className="size-3" />}
                  <span>{copiedKeyId === "new-key" ? "Copied" : "Copy"}</span>
                </Button>
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => setCreatedKey(null)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs h-8 px-4 rounded-md font-medium"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-2xs p-4">
            <div className="w-full max-w-xs rounded-lg border border-zinc-200 bg-white p-5 shadow-lg">
              <h2 className="text-sm font-bold text-zinc-950">Delete API Key?</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Requests using this key will immediately fail.
              </p>
              <div className="flex items-center justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirmId(null)}
                  className="h-8 text-xs text-zinc-600"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ApiKeys;
