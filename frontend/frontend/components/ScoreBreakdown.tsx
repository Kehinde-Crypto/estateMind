interface ScoreBreakdownProps {
  breakdown: {
    budget_match: number;
    location_match: number;
    wifi_match: number;
    beach_distance_match: number;
    rating_score: number;
    availability_bonus: number;
  };
  totalScore: number;
}

export default function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  const maxScores = {
    budget_match: 40,
    location_match: 15,
    wifi_match: 15,
    beach_distance_match: 10,
    rating_score: 20,
    availability_bonus: 10
  };

  const labels: Record<keyof typeof maxScores, string> = {
    budget_match: "Budget Fit",
    location_match: "Location",
    wifi_match: "WiFi Speed",
    beach_distance_match: "Beach Distance",
    rating_score: "Rating",
    availability_bonus: "Availability"
  };

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-secondary">Match Analysis</span>
        <span className="text-sm font-bold text-accent">{totalScore.toFixed(1)} / 110</span>
      </div>
      
      <div className="space-y-2">
        {Object.entries(breakdown).map(([key, value]) => {
          const k = key as keyof typeof maxScores;
          const max = maxScores[k];
          const percentage = (value / max) * 100;
          
          return (
            <div key={key} className="flex items-center gap-3 text-xs">
              <span className="w-24 text-muted truncate" title={labels[k]}>
                {labels[k]}
              </span>
              <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-success rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-secondary">
                {value}
                <span className="opacity-50">/{max}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
