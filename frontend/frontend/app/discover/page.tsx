"use client";

import { useEffect, useState, useMemo } from 'react';
import PropertyCard, { Property } from '@/components/PropertyCard';
import { Building2, Loader2, AlertCircle, Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';

const LOCATIONS = ['All Locations', 'Lagos', 'Abuja', 'Port Harcourt'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
];

export default function DiscoverPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/properties`);
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

  const filtered = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }

    // Location filter
    if (location !== 'All Locations') {
      result = result.filter(p =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sort
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating_desc') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [properties, search, location, sort]);

  const hasFilters = search || location !== 'All Locations' || sort !== 'default';

  const clearFilters = () => {
    setSearch('');
    setLocation('All Locations');
    setSort('default');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-elevated border border-border flex items-center justify-center text-accent">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Discover Properties</h1>
            <p className="text-secondary mt-1">Browse all available accommodations in the network.</p>
          </div>
        </div>
        <Link
          href="/recommend"
          className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-accent text-black font-semibold transition-all hover:bg-accent/90 shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] shrink-0"
        >
          Generate AI Recommendations
        </Link>
      </div>

      {/* Filters Row */}
      {!loading && !error && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface border border-border focus:border-accent focus:outline-none text-sm text-primary placeholder:text-secondary transition-colors"
            />
          </div>

          {/* Location Dropdown */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2.5 rounded-lg bg-surface border border-border focus:border-accent focus:outline-none text-sm text-primary cursor-pointer transition-colors"
          >
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc} className="bg-surface">{loc}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-secondary shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-surface border border-border focus:border-accent focus:outline-none text-sm text-primary cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-surface">{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-border hover:border-error/50 text-secondary hover:text-error text-sm transition-colors shrink-0"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && !error && properties.length > 0 && (
        <p className="text-sm text-secondary">
          Showing <span className="text-accent font-semibold">{filtered.length}</span> of{' '}
          <span className="font-semibold text-primary">{properties.length}</span> properties
        </p>
      )}

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
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-secondary border border-dashed border-border rounded-xl">
          <Building2 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium text-primary">
            {hasFilters ? 'No properties match your filters' : 'No properties found'}
          </p>
          <p className="mt-1">
            {hasFilters
              ? <button onClick={clearFilters} className="text-accent hover:underline">Clear filters</button>
              : 'The network is currently empty.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

    </div>
  );
}
