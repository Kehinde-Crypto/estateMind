import { MapPin, Wifi, Waves, Star } from 'lucide-react';

export interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  wifi_speed: number;
  beach_distance: number;
  rating: number;
  available: boolean;
  image_url: string;
  amenities: string[];
}

interface PropertyCardProps {
  property: Property;
  rank?: number;
  score?: number;
  explanation?: string;
  scoreBreakdown?: any;
  onBookClick?: (property: Property) => void;
}

export default function PropertyCard({ property, rank, score, explanation, scoreBreakdown, onBookClick }: PropertyCardProps) {
  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col card-hover h-full">
      {/* Image area */}
      <div className="h-48 bg-elevated relative flex items-center justify-center overflow-hidden">
        {property.image_url ? (
          <img 
            src={property.image_url} 
            alt={property.name} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-elevated to-surface opacity-80" />
            <BuildingIcon />
          </>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {rank && (
            <div className="px-3 py-1 bg-accent text-inverse font-bold text-sm rounded-lg shadow-lg">
              #{rank} Match
            </div>
          )}
          {!property.available && (
            <div className="px-3 py-1 bg-error text-white font-bold text-sm rounded-lg shadow-lg">
              Unavailable
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 px-3 py-1 bg-surface/80 backdrop-blur-md border border-border text-primary font-bold text-sm rounded-lg flex items-center gap-1">
          <Star size={14} className="text-warning fill-warning" />
          {property.rating}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold line-clamp-1" title={property.name}>{property.name}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-secondary text-sm mb-4">
          <MapPin size={14} />
          {property.location}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-secondary bg-elevated px-3 py-2 rounded-lg">
            <Wifi size={16} className="text-accent" />
            <span>{property.wifi_speed} Mbps</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary bg-elevated px-3 py-2 rounded-lg">
            <Waves size={16} className="text-accent-secondary" />
            <span>{property.beach_distance}m</span>
          </div>
        </div>
        
        {explanation && (
          <div className="mb-6 p-3 bg-accent-glow border border-accent/20 rounded-lg text-sm text-primary">
            <div className="flex items-start gap-2">
              <SparklesIcon />
              <p className="leading-relaxed">{explanation}</p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">{property.price}</span>
            <span className="text-muted text-sm ml-1">USDC / night</span>
          </div>
          
          {onBookClick && (
            <button 
              onClick={() => onBookClick(property)}
              disabled={!property.available}
              className="px-6 py-2 bg-accent hover:bg-accent-hover text-inverse font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,212,170,0.2)]"
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-50 relative z-10">
      <path d="M4 10v11" />
      <path d="M20 10v11" />
      <path d="M4 10l8-8 8 8" />
      <path d="M10 21v-7h4v7" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent flex-shrink-0 mt-0.5">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
