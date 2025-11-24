import React, { useState, useEffect, useCallback } from 'react';
import SourcingCycle from './components/SourcingCycle';
import ContentPanel from './components/ContentPanel';
import { STEPS, ProcessStep } from './types';
import { generateStepDetails } from './services/geminiService';

const App: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const [contentCache, setContentCache] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeStep = STEPS.find(s => s.id === activeStepId) || STEPS[0];

  const fetchContent = useCallback(async (step: ProcessStep, forceRefresh = false) => {
    if (!forceRefresh && contentCache[step.id]) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const text = await generateStepDetails(step);
      setContentCache(prev => ({
        ...prev,
        [step.id]: text
      }));
    } catch (err: any) {
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [contentCache]);

  useEffect(() => {
    fetchContent(activeStep);
  }, [activeStepId, fetchContent]);

  const handleRefresh = () => {
    fetchContent(activeStep, true);
  };

  return (
    // Outer container: Flex centering for standalone view, but acts as a wrapper for Embeds
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 lg:p-8 font-sans">
      
      {/* 
        WIDGET CONTAINER
        Fixed height (h-[850px]) and Max Width (max-w-6xl) ensure it fits perfectly 
        inside a WordPress iframe or page container without breaking layout.
      */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[850px]">
        
        {/* Header Bar for the Widget */}
        <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">Forklift Sourcing Master</h1>
            <p className="text-slate-400 text-sm">Interactive AI Guide</p>
          </div>
          <div className="flex gap-2">
             <span className="bg-primary-500 text-xs font-bold px-2 py-1 rounded text-white">V2.5</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
          
          {/* Left Column: Visual Navigation */}
          <div className="relative h-full flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center">
              
              <div className="text-center mb-6 shrink-0 w-full">
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Select Process Step</h2>
              </div>
              
              {/* Sourcing Cycle Component */}
              <div className="w-full max-w-[500px] aspect-square shrink-0">
                <SourcingCycle 
                  activeStepId={activeStepId} 
                  onStepClick={setActiveStepId} 
                />
              </div>
              
               {/* Pro Tip Box */}
              <div className="mt-8 bg-primary-50 border border-primary-100 rounded-xl p-5 shadow-sm w-full max-w-[500px]">
                <h4 className="font-bold text-primary-800 text-base mb-2 flex items-center gap-2">
                  <span>💡</span> Pro Tip:
                </h4>
                <p className="text-sm text-primary-900 leading-relaxed">
                  When sourcing forklifts from China, always ask for the <b>Engine Certificate</b> (EPA for USA, Euro 5 for EU) before paying the deposit.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Content */}
          <div className="h-full overflow-hidden bg-slate-50">
            {/* We pass a slightly different styling prop or just rely on ContentPanel's internal sizing */}
            <ContentPanel 
              step={activeStep}
              content={contentCache[activeStepId] || ""}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;