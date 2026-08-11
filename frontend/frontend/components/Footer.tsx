// frontend/frontend/components/Footer.tsx
import Link from 'next/link';
import { Sparkles, ShieldCheck, Cpu, Wallet, GitBranch } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-secondary flex items-center justify-center font-bold text-lg text-black shadow-[0_0_15px_rgba(0,212,170,0.4)]">
                E
              </div>
              <span className="font-bold text-xl tracking-tight text-primary">EstateMind</span>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Autonomous financial agent layer for discovering, evaluating, approving, and settling accommodation bookings on-chain.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Polygon Amoy Testnet Active
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-primary uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li>
                <Link href="/discover" className="hover:text-accent transition-colors">
                  Discover Properties
                </Link>
              </li>
              <li>
                <Link href="/recommend" className="hover:text-accent transition-colors flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent" />
                  AI Recommendation
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-accent transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="hover:text-accent transition-colors flex items-center gap-1.5">
                  <Wallet size={14} className="text-accent" />
                  Circle Wallet
                </Link>
              </li>
            </ul>
          </div>

          {/* Agent Tech Stack */}
          <div>
            <h4 className="font-semibold text-sm text-primary uppercase tracking-wider mb-4">Agent Stack</h4>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li className="flex items-center gap-2">
                <Cpu size={14} className="text-accent" />
                <span>Recommendation Agent (Gemini 3.5)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-accent font-bold" />
                <span>Treasury Gatekeeper Agent</span>
              </li>
              <li className="flex items-center gap-2">
                <Wallet size={14} className="text-accent" />
                <span>Settlement Agent (Circle W3S)</span>
              </li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h4 className="font-semibold text-sm text-primary uppercase tracking-wider mb-4">Network & Code</h4>
            <ul className="space-y-2.5 text-sm text-secondary">
              <li>FastAPI + SQLite Persistence</li>
              <li>Next.js 16 + Tailwind CSS v4</li>
              <li>Polygon Amoy Testnet USDC</li>
              <li className="pt-2">
                <a 
                  href="https://github.com/Kehinde-Crypto/estateMind" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-accent text-xs font-mono text-secondary hover:text-primary transition-colors"
                >
                  <GitBranch size={14} />
                  GitHub Repository ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border/50 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-4">
          <p>© {new Date().getFullYear()} EstateMind. Autonomous Commerce Protocol.</p>
          <p className="font-mono text-muted">Powered by Circle Web3 & Google Gemini</p>
        </div>
      </div>
    </footer>
  );
}
