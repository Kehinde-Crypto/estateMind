"use client";

import { useEffect, useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Loader2, RotateCcw } from 'lucide-react';

export default function WalletPage() {
  const [walletData, setWalletData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/wallet');
      const json = await res.json();
      if (json.success) {
        setWalletData(json.data);
      } else {
        throw new Error(json.error?.message || "Failed to load wallet.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/wallet/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_balance: 100000 })
      });
      if (res.ok) fetchWallet();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pt-4">
      
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet Dashboard</h1>
            <p className="text-secondary mt-1">Simulated Circle USDC Wallet</p>
          </div>
        </div>
        
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-border hover:border-accent text-secondary hover:text-accent rounded-lg transition-colors text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset Balance
        </button>
      </div>

      {loading && !walletData ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-accent" /></div>
      ) : error ? (
        <div className="p-6 bg-error/10 text-error rounded-xl">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-2xl bg-gradient-to-br from-surface to-elevated border border-accent/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <p className="text-secondary font-medium mb-2 relative z-10">Total Balance</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <h2 className="text-5xl font-bold tracking-tighter text-primary">
                  {walletData.wallet.balance.toLocaleString()}
                </h2>
                <span className="text-accent font-semibold text-xl">USDC</span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50 relative z-10">
                <p className="text-xs text-muted font-mono break-all bg-base/50 p-2 rounded border border-border/50">
                  {walletData.wallet.address}
                </p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border bg-elevated/50">
                <h3 className="font-semibold text-lg">Transaction History</h3>
              </div>
              
              <div className="divide-y divide-border">
                {walletData.transactions.length === 0 ? (
                  <div className="p-8 text-center text-secondary">
                    No transactions yet.
                  </div>
                ) : (
                  // Reverse array to show newest first
                  [...walletData.transactions].reverse().map((tx: any) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-elevated/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'debit' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                        }`}>
                          {tx.type === 'debit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                          <p className="font-medium text-primary">{tx.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted mt-1">
                            <span>{new Date(tx.timestamp).toLocaleString()}</span>
                            <span>•</span>
                            <span className="font-mono">{tx.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`font-bold font-mono ${tx.type === 'debit' ? 'text-primary' : 'text-success'}`}>
                        {tx.type === 'debit' ? '-' : '+'}{tx.amount} USDC
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
