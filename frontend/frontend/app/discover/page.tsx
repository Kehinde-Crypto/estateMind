"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { Building2, Loader2, AlertCircle } from 'lucide-react';

export default function DiscoverPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('http://localhost:8000/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        
        const json = await res.json();
        if (json.success) {
          setProperties(json.data.properties);
        } else {
          throw new Error(json.error?.message || 'Unknown error');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-primary">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discover Properties</h1>
            <p className="text-secondary mt-1">Browse all available accommodations in the network.</p>
          </div>
        </div>
        
        <Link 
          href="/recommend"
          className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-accent text-accent-foreground font-medium transition-all hover:bg-accent/90 shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)]"
        >
          Generate AI Recommendations
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-secondary">
          <Loader2 size={32} className="animate-spin text-accent mb-4" />
          <p>Loading properties...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error">
          <AlertCircle className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold">Failed to load properties</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-secondary border border-dashed border-border rounded-xl">
          <Building2 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-primary">No properties found</p>
          <p>The network is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
            />
          ))}
        </div>
      )}
      
    </div>
  );
}
