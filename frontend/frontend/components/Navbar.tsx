"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Wallet, Building2, Sparkles, CalendarCheck, Menu, X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/wallet`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.wallet?.balance !== undefined) {
            setWalletBalance(data.data.wallet.balance);
          }
        }
      } catch (e) {
        // Silently handle backend offline
      }
    }
    fetchBalance();
  }, [pathname]);

  const navLinks = [
    { href: '/discover', label: 'Discover', icon: Building2 },
    { href: '/recommend', label: 'Recommend', icon: Sparkles },
    { href: '/bookings', label: 'Bookings', icon: CalendarCheck },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-secondary flex items-center justify-center font-bold text-black shadow-[0_0_12px_rgba(0,212,170,0.4)]">
            E
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">EstateMind</span>
        </Link>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'text-accent bg-accent/10 border border-accent/20 font-semibold'
                    : 'text-secondary hover:text-primary hover:bg-elevated/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-accent' : ''} />
                {link.label}
              </Link>
            );
          })}
        </div>
        
        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link 
            href="/wallet" 
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-elevated border transition-all text-sm font-medium ${
              pathname === '/wallet' 
                ? 'border-accent text-accent shadow-[0_0_15px_rgba(0,212,170,0.25)]' 
                : 'border-border hover:border-accent text-primary'
            }`}
          >
            <Wallet size={16} className="text-accent" />
            <span className="hidden sm:inline">Wallet</span>
            {walletBalance !== null && (
              <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                {walletBalance.toLocaleString()} USDC
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-elevated border border-border text-secondary hover:text-primary"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-surface/95 backdrop-blur-xl border-b border-border z-40 p-4 space-y-2 md:hidden animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'text-accent bg-accent/10 border border-accent/20 font-semibold'
                    : 'text-secondary hover:text-primary hover:bg-elevated'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : ''} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
