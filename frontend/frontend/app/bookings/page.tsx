"use client";

import { useEffect, useState } from 'react';
import { CalendarCheck, Loader2, CalendarDays, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('http://localhost:8000/api/bookings');
        if (!res.ok) throw new Error('Failed to fetch bookings');
        
        const json = await res.json();
        if (json.success) {
          setBookings(json.data.bookings);
        } else {
          throw new Error(json.error?.message || 'Unknown error');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent">
          <CalendarCheck size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Bookings</h1>
          <p className="text-secondary mt-1">Manage and view your autonomous booking history.</p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-secondary">
          <Loader2 size={32} className="animate-spin text-accent mb-4" />
          <p>Loading your bookings...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error">
          <p>Failed to load bookings: {error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-secondary border border-dashed border-border rounded-xl">
          <CalendarDays size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-primary">No bookings found</p>
          <p className="mb-6">You haven't made any bookings yet.</p>
          <Link href="/discover" className="inline-flex px-6 py-2 bg-accent text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking: any) => (
            <div key={booking.id} className="glass p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent/30 transition-colors">
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg text-primary">{booking.property_name}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    booking.status === 'settled' ? 'bg-success/20 text-success' :
                    booking.status === 'failed' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {booking.check_in} to {booking.check_out}
                  </div>
                  <div className="font-mono text-xs opacity-75">
                    ID: {booking.id}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t border-border pt-4 md:border-t-0 md:pt-0">
                <div className="text-right">
                  <p className="text-sm text-secondary">Total Cost</p>
                  <p className="text-xl font-bold text-accent">{booking.total_price} USDC</p>
                </div>
                <Link href={`/wallet`} className="text-xs flex items-center gap-1 text-primary hover:text-accent transition-colors">
                  View in Wallet <ExternalLink size={12} />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
