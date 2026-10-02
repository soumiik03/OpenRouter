import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useProfile, useOnramp } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Credits() {
  const [selectedPackage, setSelectedPackage] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: profile, isLoading } = useProfile();
  const onrampMutation = useOnramp();

  const packages = [
    { credits: 10000, price: "$10.00" },
    { credits: 25000, price: "$25.00" },
    { credits: 50000, price: "$50.00" },
    { credits: 100000, price: "$100.00" },
  ];

  const handleOnramp = async (amount: number) => {
    setSuccessMessage(null);
    try {
      await onrampMutation.mutateAsync({ amount });
      setSuccessMessage(`Added ${amount.toLocaleString()} credits to your account.`);
      setCustomAmount("");
    } catch (err) {
      console.error("Onramp error:", err);
    }
  };

  const currentBalance = profile?.credits ?? 1000;
  const dollarEquivalent = (currentBalance / 1000).toFixed(2);

  const transactions = profile?.onrampTransactions?.length
    ? profile.onrampTransactions
    : [{ id: 1, amount: 1000, status: "COMPLETED", date: "Initial Balance" }];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-3 border-b border-zinc-200/80">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-950">Credits & Billing</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Pre-fund credits for API request routing.</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-md border border-emerald-200 bg-emerald-50 flex items-center gap-2 text-emerald-800 text-xs">
            <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Balance Card */}
        <div className="p-5 rounded-lg border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="text-xs text-zinc-500 font-medium">Current Balance</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-zinc-950 tracking-tight">
              {isLoading ? "..." : currentBalance.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-zinc-500">credits (~${dollarEquivalent} USD)</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">1,000 credits = $1.00 USD. Pay-as-you-go with zero markup.</p>
        </div>

        {/* Top-up Options */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Add Credits</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.credits;
              return (
                <div
                  key={pkg.credits}
                  onClick={() => setSelectedPackage(pkg.credits)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-50/80 shadow-2xs"
                      : "border-zinc-200/80 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="text-base font-bold font-mono text-zinc-950">
                    {pkg.credits.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5 font-mono">{pkg.price} USD</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                type="number"
                placeholder="Custom amount (e.g. 15000)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full sm:w-48 bg-white border-zinc-200 text-xs text-zinc-900 h-8 rounded-md"
              />
              <Button
                onClick={() => {
                  const amt = parseInt(customAmount, 10);
                  if (amt > 0) handleOnramp(amt);
                }}
                disabled={!customAmount || parseInt(customAmount, 10) <= 0 || onrampMutation.isPending}
                size="sm"
                className="h-8 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-md shrink-0 font-medium"
              >
                Top Up
              </Button>
            </div>

            <Button
              onClick={() => handleOnramp(selectedPackage)}
              disabled={onrampMutation.isPending}
              size="sm"
              className="w-full sm:w-auto h-8 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-medium px-4 shadow-xs"
            >
              {onrampMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin mx-auto" />
              ) : (
                `Add ${selectedPackage.toLocaleString()} Credits`
              )}
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="border border-zinc-200/80 rounded-lg bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="p-3.5 border-b border-zinc-200/80">
            <h2 className="text-xs font-semibold text-zinc-950 uppercase tracking-wider">Billing History</h2>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/70 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase">
              <tr>
                <th className="py-2.5 px-4 font-medium">Transaction</th>
                <th className="py-2.5 px-4 font-medium">Credits</th>
                <th className="py-2.5 px-4 font-medium">Amount</th>
                <th className="py-2.5 px-4 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-zinc-500">TXN-{tx.id}</td>
                  <td className="py-2.5 px-4 font-mono font-medium text-zinc-950">
                    +{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-zinc-600">
                    ${(tx.amount / 1000).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="text-[11px] text-zinc-600 capitalize">
                      {tx.status.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Credits;
