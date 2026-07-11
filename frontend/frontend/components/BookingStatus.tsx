import { CheckCircle2, XCircle, Clock, ArrowRight, CircleDashed } from 'lucide-react';

interface BookingStatusProps {
  status: 'idle' | 'processing' | 'approved' | 'rejected' | 'settled' | 'failed';
  message?: string;
}

export default function BookingStatus({ status, message }: BookingStatusProps) {
  // Define pipeline stages
  const stages = [
    { id: 'treasury', label: 'Treasury Review' },
    { id: 'settlement', label: 'USDC Settlement' },
    { id: 'complete', label: 'Confirmation' }
  ];

  // Determine active stage based on overall status
  const getStageState = (stageIndex: number) => {
    if (status === 'idle') return 'pending';
    
    if (status === 'rejected') {
      return stageIndex === 0 ? 'error' : 'pending';
    }
    
    if (status === 'failed') {
      return stageIndex === 0 ? 'completed' : stageIndex === 1 ? 'error' : 'pending';
    }

    if (status === 'processing') {
      return stageIndex === 0 ? 'active' : 'pending';
    }

    if (status === 'approved') {
      return stageIndex === 0 ? 'completed' : stageIndex === 1 ? 'active' : 'pending';
    }

    if (status === 'settled') {
      return 'completed';
    }

    return 'pending';
  };

  return (
    <div className="w-full glass p-6 rounded-xl space-y-6">
      
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -z-10 -translate-y-1/2">
          {status === 'settled' && (
            <div className="h-full bg-accent transition-all duration-1000 w-full" />
          )}
          {(status === 'approved' || status === 'failed') && (
            <div className="h-full bg-accent transition-all w-1/2" />
          )}
        </div>

        {stages.map((stage, idx) => {
          const state = getStageState(idx);
          
          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 bg-surface px-2">
              {state === 'completed' && (
                <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
              )}
              {state === 'active' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(0,212,170,0.4)]">
                  <Clock size={18} className="animate-spin-slow" />
                </div>
              )}
              {state === 'error' && (
                <div className="w-8 h-8 rounded-full bg-error/20 text-error flex items-center justify-center">
                  <XCircle size={20} />
                </div>
              )}
              {state === 'pending' && (
                <div className="w-8 h-8 rounded-full bg-elevated text-muted flex items-center justify-center">
                  <CircleDashed size={18} />
                </div>
              )}
              <span className={`text-xs font-medium ${state === 'active' ? 'text-primary' : 'text-secondary'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm flex items-start gap-3 ${
          status === 'rejected' || status === 'failed' ? 'bg-error/10 text-error border border-error/20' :
          status === 'settled' ? 'bg-success/10 text-success border border-success/20' :
          'bg-elevated text-primary border border-border'
        }`}>
          {(status === 'rejected' || status === 'failed') ? <XCircle size={18} className="shrink-0 mt-0.5" /> : 
           status === 'settled' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : 
           <Clock size={18} className="shrink-0 mt-0.5 text-accent" />}
          <p>{message}</p>
        </div>
      )}
      
    </div>
  );
}
