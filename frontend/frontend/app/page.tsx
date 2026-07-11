import Link from 'next/link';
import { Sparkles, Building2, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto space-y-12">
      
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-border text-sm font-medium text-accent mb-4">
          <Sparkles size={16} />
          <span>Meet your Autonomous Financial Agent</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-tight">
          The autonomous layer for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">
            accommodation commerce
          </span>
        </h1>
        
        <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
          Set your preferences. Let EstateMind discover, evaluate, approve, and settle bookings automatically using USDC. No manual intervention required.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
        <Link 
          href="/recommend" 
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-lg bg-accent hover:bg-accent-hover text-inverse font-semibold transition-all shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] transform hover:-translate-y-1"
        >
          <Sparkles size={20} />
          Start Recommendation
        </Link>
        <Link 
          href="/discover" 
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-lg bg-transparent border border-border hover:border-accent hover:bg-accent-glow text-primary font-medium transition-all"
        >
          <Building2 size={20} />
          Browse Properties
        </Link>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16">
        <div className="glass p-6 rounded-2xl text-left space-y-4 hover:border-accent transition-colors">
          <div className="w-12 h-12 rounded-lg bg-elevated flex items-center justify-center text-accent">
            <Building2 size={24} />
          </div>
          <h3 className="text-xl font-semibold">AI Discovery</h3>
          <p className="text-secondary text-sm">Agents evaluate properties against your strict criteria across multiple data points.</p>
        </div>
        
        <div className="glass p-6 rounded-2xl text-left space-y-4 hover:border-accent-secondary transition-colors">
          <div className="w-12 h-12 rounded-lg bg-elevated flex items-center justify-center text-accent-secondary">
            <Wallet size={24} />
          </div>
          <h3 className="text-xl font-semibold">Treasury Approval</h3>
          <p className="text-secondary text-sm">Financial guardrails ensure bookings never exceed your budget or drain your wallet.</p>
        </div>
        
        <div className="glass p-6 rounded-2xl text-left space-y-4 hover:border-success transition-colors">
          <div className="w-12 h-12 rounded-lg bg-elevated flex items-center justify-center text-success">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-semibold">USDC Settlement</h3>
          <p className="text-secondary text-sm">Instant simulated settlement mimicking on-chain stablecoin transactions.</p>
        </div>
      </div>
      
    </div>
  );
}
