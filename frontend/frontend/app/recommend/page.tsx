"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, Wifi, Waves, DollarSign, Calendar } from 'lucide-react';
import PropertyCard, { Property } from '@/components/PropertyCard';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import { API_BASE_URL } from '@/lib/api';

const PRESETS = [
  {
    label: '🏖️ Beach Lover',
    values: { budget: 8000, location: 'Lagos', min_wifi_speed: 10, max_beach_distance: 200, duration_days: 5 }
  },
  {
    label: '💻 Work Remote',
    values: { budget: 12000, location: 'Abuja', min_wifi_speed: 100, max_beach_distance: 5000, duration_days: 14 }
  },
  {
    label: '💰 Budget Travel',
    values: { budget: 3000, location: 'Port Harcourt', min_wifi_speed: 20, max_beach_distance: 3000, duration_days: 3 }
  },
];

function SliderField({ label, name, value, min, max, step, format, icon: Icon, onChange }: {
  label: string; name: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; icon: any; onChange: (name: string, value: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-secondary flex items-center gap-1.5">
          <Icon size={14} className="text-accent" />
          {label}
        </label>
        <span className="text-sm font-mono font-bold text-accent">{format(value)}</span>
      </div>
      <div className="relative h-2 bg-elevated rounded-full">
        <div
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-accent to-secondary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(name, Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-black shadow-[0_0_8px_rgba(0,212,170,0.6)] transition-all"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function RecommendPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    budget: 10000,
    location: 'Lagos',
    min_wifi_speed: 30,
    max_beach_distance: 1000,
    duration_days: 7
  });

  const handleSlider = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setFormData(preset.values);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to get recommendations');
      }
      setResults(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (property: Property) => {
    localStorage.setItem('estate_preference', JSON.stringify(formData));
    router.push(`/booking?propertyId=${property.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Recommendation</h1>
          <p className="text-secondary mt-1">Set your preferences and let the agent find your perfect match.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Form Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass p-6 rounded-2xl sticky top-24 space-y-6">
            <h2 className="text-lg font-semibold">Your Preferences</h2>

            {/* Presets */}
            <div>
              <p className="text-xs text-muted font-medium uppercase tracking-wider mb-2">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent hover:text-accent text-secondary transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <SliderField
                label="Max Budget per Night"
                name="budget"
                value={formData.budget}
                min={1000}
                max={50000}
                step={500}
                format={(v) => `${v.toLocaleString()} USDC`}
                icon={DollarSign}
                onChange={handleSlider}
              />

              <div>
                <label className="text-sm font-medium text-secondary mb-1.5 block">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent transition-all"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </select>
              </div>

              <SliderField
                label="Min WiFi Speed"
                name="min_wifi_speed"
                value={formData.min_wifi_speed}
                min={5}
                max={500}
                step={5}
                format={(v) => `${v} Mbps`}
                icon={Wifi}
                onChange={handleSlider}
              />

              <SliderField
                label="Max Beach Distance"
                name="max_beach_distance"
                value={formData.max_beach_distance}
                min={100}
                max={10000}
                step={100}
                format={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)} km` : `${v} m`}
                icon={Waves}
                onChange={handleSlider}
              />

              <SliderField
                label="Duration"
                name="duration_days"
                value={formData.duration_days}
                min={1}
                max={30}
                step={1}
                format={(v) => `${v} day${v > 1 ? 's' : ''}`}
                icon={Calendar}
                onChange={handleSlider}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent hover:bg-accent/90 text-black font-bold rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)]"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Agent Evaluating...' : 'Find Matches'}
              </button>

              {error && (
                <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          {!results && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-secondary border border-dashed border-border rounded-2xl">
              <Sparkles size={48} className="mb-4 opacity-30" />
              <p className="text-lg">Submit your preferences to see AI recommendations</p>
              <p className="text-sm mt-2 text-muted">Or try one of the quick presets above</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-secondary">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-elevated rounded-full"></div>
                <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="animate-pulse text-lg text-primary">Agent is evaluating properties...</p>
              <p className="text-sm text-muted mt-2">Scoring against your preferences</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold">Top Recommendations</h2>
                <span className="text-sm text-secondary">Evaluated {results.total_evaluated} properties</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recommendations.map((rec: any) => (
                  <div key={rec.property.id}>
                    <PropertyCard
                      property={rec.property}
                      rank={rec.rank}
                      score={rec.score}
                      explanation={rec.explanation}
                      onBookClick={handleBook}
                    />
                    <div className="mt-2 glass p-4 rounded-xl border border-border">
                      <ScoreBreakdown breakdown={rec.score_breakdown} totalScore={rec.score} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
