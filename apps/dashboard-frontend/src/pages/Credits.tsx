import React, { useState } from "react";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
import { useProfile, useOnramp, useTransactions } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";

export function Credits() {
  const [selectedPreset, setSelectedPreset] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: txData, isLoading: isTxLoading } = useTransactions();
  const onrampMutation = useOnramp();

  const presetPackages = [
    { credits: 1000, price: "$1.00" },
    { credits: 5000, price: "$5.00" },
    { credits: 10000, price: "$10.00" },
    { credits: 25000, price: "$25.00" },
    { credits: 50000, price: "$50.00" },
  ];

  const parsedCustom = parseInt(customAmount, 10);
  const isCustomActive = !isNaN(parsedCustom) && parsedCustom > 0;
  const currentAmountToAdd = isCustomActive ? parsedCustom : selectedPreset;
  const priceFormatted = (currentAmountToAdd / 1000).toFixed(2);

  const handleSelectPreset = (credits: number) => {
    setSelectedPreset(credits);
    setCustomAmount("");
    setSuccessMessage(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSuccessMessage(null);
  };

  const handleAddCredits = async () => {
    if (currentAmountToAdd <= 0) return;
    setSuccessMessage(null);
    try {
      await onrampMutation.mutateAsync({ amount: currentAmountToAdd });
      setSuccessMessage(`Successfully added ${currentAmountToAdd.toLocaleString()} credits to your account.`);
      setCustomAmount("");
    } catch (err: any) {
      console.error("Onramp error:", err);
    }
  };

  const currentBalance = profile?.credits ?? 1000;
  const dollarEquivalent = (currentBalance / 1000).toFixed(2);
  const transactions = txData?.transactions || profile?.onrampTransactions || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white font-['Space_Grotesk']">
            Credits & Billing
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
            Add credits to your account. Standard rate: 1,000 credits = $1.00 USD.
          </p>
        </div>

        {successMessage && (
          <div className="p-3 border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs rounded-none font-mono">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Current Balance
          </div>
          <div className="mt-1.5 flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-bold text-zinc-950 dark:text-white tracking-tight">
              {isProfileLoading ? "..." : currentBalance.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500 uppercase">credits</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              ~${dollarEquivalent} USD
            </span>
          </div>
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white">
              Add Credits
            </h2>
            <span className="text-[10px] font-mono text-zinc-500">
              Rate: 1,000 cr / $1.00
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {presetPackages.map((pkg) => {
              const isSelected = !isCustomActive && selectedPreset === pkg.credits;
              return (
                <button
                  key={pkg.credits}
                  type="button"
                  onClick={() => handleSelectPreset(pkg.credits)}
                  className={`p-3.5 border text-left transition-all rounded-none cursor-pointer ${
                    isSelected
                      ? "border-2 border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  <div className="text-base font-bold font-mono text-zinc-950 dark:text-white">
                    {pkg.credits.toLocaleString()}
                    <span className="text-[10px] text-zinc-500 ml-1 font-normal">cr</span>
                  </div>
                  <div className={`text-xs font-mono mt-1 ${isSelected ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-500"}`}>
                    {pkg.price} USD
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex items-center border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black h-10 px-3 flex-1 max-w-sm rounded-none">
              <span className="text-zinc-400 dark:text-zinc-600 text-xs mr-2 font-mono">$</span>
              <input
                type="number"
                min="1"
                step="100"
                placeholder="Or custom amount (e.g. 50000)"
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full bg-transparent text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-mono focus:outline-hidden"
              />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase ml-2 font-mono">credits</span>
            </div>

            <button
              onClick={handleAddCredits}
              disabled={onrampMutation.isPending || currentAmountToAdd <= 0}
              className="w-full sm:w-auto h-10 px-6 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {onrampMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5 stroke-[2.5]" />
                  <span>Add {currentAmountToAdd.toLocaleString()} Credits (${priceFormatted} USD)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-none overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-black">
            <h2 className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
              Billing History
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {transactions.length} {transactions.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {isTxLoading ? (
            <div className="p-10 text-center text-xs text-zinc-500 font-mono">
              <Loader2 className="size-4 animate-spin mx-auto mb-2 text-zinc-400" />
              Loading history...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-xs text-zinc-500 font-mono">
              No transactions recorded yet. Add credits above to top up your account.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-medium">TRANSACTION ID</th>
                  <th className="py-2.5 px-4 font-medium">CREDITS</th>
                  <th className="py-2.5 px-4 font-medium">AMOUNT</th>
                  <th className="py-2.5 px-4 text-right font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 text-zinc-700 dark:text-zinc-300">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                      <span className="px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-zinc-700 dark:text-zinc-300">
                        TXN-{tx.id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      +{tx.amount.toLocaleString()} cr
                    </td>
                    <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                      ${(tx.amount / 1000).toFixed(2)} USD
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase rounded-none">
                        <span className="size-1.5 bg-emerald-500 dark:bg-emerald-400" />
                        {tx.status}
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

export default Credits;
