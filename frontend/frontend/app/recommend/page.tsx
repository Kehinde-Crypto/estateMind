"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import PropertyCard, { Property } from '@/components/PropertyCard';
import ScoreBreakdown from '@/components/ScoreBreakdown';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'location' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/api/recommend', {
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
    // Store preference in localStorage to pass it to the booking page
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
          <div className="glass p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              Preferences
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Max Budget (USDC / night)</label>
                <input 
                  type="number" 
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Location</label>
                <select 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all appearance-none"
                  required
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Min WiFi Speed (Mbps)</label>
                <input 
                  type="number" 
                  name="min_wifi_speed"
                  value={formData.min_wifi_speed}
                  onChange={handleChange}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Max Beach Distance (meters)</label>
                <input 
                  type="number" 
                  name="max_beach_distance"
                  value={formData.max_beach_distance}
                  onChange={handleChange}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Duration (Days)</label>
                <input 
                  type="number" 
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  min={1}
                  className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 py-3 bg-accent hover:bg-accent-hover text-inverse font-semibold rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Evaluating...' : 'Find Matches'}
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-error/10 border border-error/20 text-error text-sm rounded-lg">
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
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-secondary">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-elevated rounded-full"></div>
                <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="animate-pulse text-lg text-primary">Agent is evaluating properties...</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-2xl font-bold">Top Recommendations</h2>
                <span className="text-sm text-secondary">Evaluated {results.total_evaluated} properties</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.recommendations.map((rec: any) => (
                  <div key={rec.property.id} className="h-full">
                    <PropertyCard 
                      property={rec.property}
                      rank={rec.rank}
                      score={rec.score}
                      explanation={rec.explanation}
                      onBookClick={handleBook}
                    />
                    <div className="mt-2 glass p-4 rounded-xl border border-border">
                      <ScoreBreakdown 
                        breakdown={rec.score_breakdown} 
                        totalScore={rec.score} 
                      />
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
