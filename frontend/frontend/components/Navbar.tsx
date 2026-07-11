import Link from 'next/link';
import { Wallet, Building2, Sparkles, CalendarCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center font-bold text-inverse">
          E
        </div>
        <span className="font-bold text-xl tracking-tight">EstateMind</span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-secondary">
        <Link href="/discover" className="flex items-center gap-2 hover:text-accent transition-colors">
          <Building2 size={16} />
          Discover
        </Link>
        <Link href="/recommend" className="flex items-center gap-2 hover:text-accent transition-colors">
          <Sparkles size={16} />
          Recommend
        </Link>
        <Link href="/bookings" className="flex items-center gap-2 hover:text-accent transition-colors">
          <CalendarCheck size={16} />
          Bookings
        </Link>
      </div>
      
      <div>
        <Link href="/wallet" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-elevated border border-border hover:border-accent transition-all">
          <Wallet size={16} className="text-accent" />
          <span className="text-sm font-medium">Wallet</span>
        </Link>
      </div>
    </nav>
  );
}
