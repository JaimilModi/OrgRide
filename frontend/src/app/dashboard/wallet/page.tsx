"use client";

import { useEffect, useState } from "react";
import { getWallet, getWalletHistory, rechargeWallet, confirmRecharge } from "@/lib/api";
import { Wallet, WalletTransaction } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { WalletCards, IndianRupee, Plus, ArrowDownLeft, ArrowUpRight, X, History, ShieldAlert } from "lucide-react";

export default function WalletPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [recharging, setRecharging] = useState(false);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [walletData, historyData] = await Promise.all([
        getWallet(),
        getWalletHistory()
      ]);
      setWallet(walletData);
      setTransactions(historyData || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load wallet data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargeAmount || isNaN(Number(rechargeAmount)) || Number(rechargeAmount) <= 0) {
      showToast("Please enter a valid amount greater than 0", "error");
      return;
    }

    setRecharging(true);
    try {
      const session = await rechargeWallet(Number(rechargeAmount));
      await confirmRecharge(session.id || session.sessionId || session);
      
      setRechargeAmount("");
      setIsRechargeModalOpen(false);
      showToast(`₹${rechargeAmount} added to your wallet successfully!`, "success");
      fetchWalletData();
    } catch (err: any) {
      showToast(err.message || "Recharge failed", "error");
    } finally {
      setRecharging(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      
      <div>
        <h2 className="text-[28px] font-extrabold text-text-main tracking-tight">Wallet</h2>
        <p className="text-text-sub font-medium mt-1">Manage your balance and view transaction history.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Balance Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-primary-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            {/* Abstract Background Elements */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary-700 rounded-full blur-2xl opacity-40 translate-y-1/3 -translate-x-1/4"></div>
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 100 Q 150 50, 300 150 T 600 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
              <path d="M-50 200 Q 100 100, 250 250 T 550 200" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
            </svg>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-primary-100 font-bold tracking-wide uppercase text-sm">Available Balance</h3>
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center">
                  <WalletCards size={20} className="text-primary-300" />
                </div>
              </div>
              
              <div className="mb-10">
                {loading ? (
                  <div className="h-14 bg-primary-800 rounded-xl w-48 animate-pulse"></div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-primary-400 text-3xl font-bold">₹</span>
                    <span className="text-white text-[56px] font-extrabold tracking-tighter leading-none">
                      {wallet ? Number(wallet.balance).toFixed(2) : "0.00"}
                    </span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setIsRechargeModalOpen(true)}
                className="w-full bg-primary-400 hover:bg-primary-300 text-primary-950 font-extrabold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-400/20"
              >
                <Plus size={20} strokeWidth={3} />
                Add Money
              </button>
            </div>
          </div>

          <div className="bg-surface-main p-6 rounded-[24px] border border-border-subtle shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
              <ShieldAlert size={24} className="text-primary-600" />
            </div>
            <div>
              <h4 className="font-bold text-text-main">Secure Payments</h4>
              <p className="text-sm text-text-sub mt-1 leading-relaxed">Your wallet balance is securely maintained. You can use it instantly to pay for any approved rides within the OrgRide network.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-7 bg-surface-main rounded-[32px] border border-border-subtle shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border-subtle flex items-center justify-between bg-surface-sub/50">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <History size={20} className="text-text-sub" /> Transaction History
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-border-subtle rounded-2xl animate-pulse">
                    <div className="w-12 h-12 bg-surface-sub rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-sub rounded w-1/3"></div>
                      <div className="h-3 bg-surface-sub rounded w-1/4"></div>
                    </div>
                    <div className="h-5 bg-surface-sub rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-surface-sub rounded-full flex items-center justify-center mb-6 border border-border-subtle">
                  <WalletCards size={32} className="text-text-sub opacity-50" />
                </div>
                <h4 className="text-lg font-bold text-text-main mb-2">No transactions yet</h4>
                <p className="text-text-sub max-w-[250px] mx-auto">Your recharge and payment history will appear here once you start using your wallet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'RECHARGE' || tx.type === 'CREDIT' || tx.type === 'REFUND';
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-bg-page hover:bg-surface-sub border border-border-subtle rounded-2xl transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                          isCredit
                            ? 'bg-primary-50 border-primary-100 text-primary-600'
                            : 'bg-surface-main border-border-subtle text-text-sub'
                        }`}>
                          {isCredit ? <ArrowDownLeft size={20} strokeWidth={2.5} /> : <ArrowUpRight size={20} strokeWidth={2.5} />}
                        </div>
                        <div>
                          <div className="font-bold text-text-main text-[15px]">{tx.description || tx.type}</div>
                          <div className="text-xs font-semibold text-text-sub mt-0.5">{new Date(tx.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={`font-extrabold text-[17px] ${
                        isCredit ? 'text-primary-600' : 'text-text-main'
                      }`}>
                        {isCredit ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recharge Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 bg-primary-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface-main rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-sub">
              <h3 className="text-xl font-bold text-text-main">Add Money</h3>
              <button 
                onClick={() => setIsRechargeModalOpen(false)} 
                className="p-1.5 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"
                disabled={recharging}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <form onSubmit={handleRecharge}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-text-sub uppercase tracking-wider mb-3 text-center">Amount (₹)</label>
                  <div className="relative max-w-[200px] mx-auto">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sub font-bold text-xl">₹</span>
                    <input
                      type="number"
                      autoFocus
                      className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-border-subtle focus:border-primary-500 outline-none text-2xl font-bold text-center bg-bg-page focus:bg-surface-main transition-colors"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {['500', '1000', '2000'].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className="py-2 rounded-xl border border-border-subtle hover:border-primary-400 hover:bg-primary-50 font-bold text-text-main transition-colors"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-border-subtle bg-surface-sub flex gap-3">
                <button 
                  type="submit"
                  disabled={recharging}
                  className="w-full bg-primary-900 hover:bg-primary-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {recharging ? "Processing..." : "Proceed to Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
