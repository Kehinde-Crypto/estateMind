"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CalendarCheck, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import BookingStatus from '@/components/BookingStatus';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const [property, setProperty] = useState<any>(null);
  const [preference, setPreference] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected' | 'settled' | 'failed'>('idle');
  const [pipelineMessage, setPipelineMessage] = useState<string>('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Mock dates for MVP checkout
  const checkIn = "2026-07-20";
  const checkOut = "2026-07-27";

  useEffect(() => {
    // Load property details
    async function loadData() {
      if (!propertyId) {
        setError("No property selected for booking.");
        setLoading(false);
        return;
      }

      try {
        const prefStr = localStorage.getItem('estate_preference');
        if (prefStr) {
          setPreference(JSON.parse(prefStr));
        } else {
          // Default fallback preference
          setPreference({
            budget: 10000,
            location: "Lagos",
            min_wifi_speed: 30,
            max_beach_distance: 1000,
            duration_days: 7
          });
        }

        const res = await fetch(`http://localhost:8000/api/properties/${propertyId}`);
        const json = await res.json();
        
        if (json.success) {
          setProperty(json.data.property);
        } else {
          throw new Error("Failed to load property details.");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [propertyId]);

  const handleExecuteBooking = async () => {
    setPipelineStatus('processing');
    setPipelineMessage('Treasury Agent is reviewing budget constraints...');

    try {
      // Small artificial delay to show pipeline animation
      await new Promise(r => setTimeout(r, 1500));

      const res = await fetch('http://localhost:8000/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: property.id,
          check_in: checkIn,
          check_out: checkOut,
          preference: preference
        })
      });

      const json = await res.json();

      if (!json.success) {
        if (json.error?.code === 'TREASURY_REJECTED') {
          setPipelineStatus('rejected');
          setPipelineMessage(`Treasury Rejected: ${json.error.message}`);
        } else {
          setPipelineStatus('failed');
          setPipelineMessage(`Settlement Failed: ${json.error?.message || 'Unknown error'}`);
        }
        return;
      }

      // Success
      setPipelineStatus('settled');
      setPipelineMessage('Booking successfully settled via USDC. Transaction confirmed.');
      setBookingResult(json.data);

    } catch (err: any) {
      setPipelineStatus('failed');
      setPipelineMessage(`Network Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-secondary">Loading checkout...</div>;
  }

  if (error || !property) {
    return (
      <div className="p-10 text-center text-error bg-error/10 rounded-xl">
        {error || "Property not found."}
      </div>
    );
  }

  const durationDays = preference?.duration_days || 7;
  const totalCost = property.price * durationDays;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pt-4">
      
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent">
          <CalendarCheck size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout & Settlement</h1>
          <p className="text-secondary mt-1">Autonomous financial approval pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col - Booking Summary */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-elevated rounded-lg">
                <h3 className="font-medium text-lg">{property.name}</h3>
                <p className="text-secondary text-sm">{property.location}</p>
              </div>

              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-secondary">Dates</span>
                <span className="font-medium">{checkIn} to {checkOut}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-secondary">Duration</span>
                <span className="font-medium">{durationDays} Nights</span>
              </div>

              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-secondary">Price per night</span>
                <span className="font-medium">{property.price} USDC</span>
              </div>

              <div className="flex justify-between py-4">
                <span className="text-lg font-bold">Total Cost</span>
                <span className="text-xl font-bold text-accent">{totalCost} USDC</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-accent/20">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-accent" />
              Treasury Constraints
            </h3>
            <p className="text-sm text-secondary mb-4">
              Your stated per-night budget is <strong className="text-primary">{preference.budget} USDC</strong>. 
              The Treasury Agent will strictly enforce this limit before allowing settlement.
            </p>
          </div>
        </div>

        {/* Right Col - Agent Pipeline */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Execution Pipeline</h2>
          
          <BookingStatus status={pipelineStatus} message={pipelineMessage} />

          {pipelineStatus === 'idle' && (
            <button 
              onClick={handleExecuteBooking}
              className="w-full py-4 bg-accent hover:bg-accent-hover text-inverse font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,212,170,0.2)]"
            >
              <Wallet size={20} />
              Authorize Autonomous Settlement
            </button>
          )}

          {pipelineStatus === 'settled' && bookingResult && (
            <div className="p-6 bg-success/10 border border-success/30 rounded-xl space-y-4">
              <h3 className="font-bold text-success flex items-center gap-2">
                <CheckCircle2 size={20} />
                Receipt Confirmed
              </h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-secondary">Transaction ID:</span>
                  <span className="text-primary">{bookingResult.settlement.transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Booking ID:</span>
                  <span className="text-primary">{bookingResult.booking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Wallet Balance:</span>
                  <span className="text-primary">{bookingResult.treasury_decision.financial_summary.wallet_balance_after} USDC</span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/wallet')}
                className="w-full mt-4 py-2 border border-accent text-accent hover:bg-accent/10 rounded-lg font-medium transition-colors"
              >
                View Wallet Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
