import React from 'react';
import { STEPS } from '../types';

interface SourcingCycleProps {
  activeStepId: number;
  onStepClick: (id: number) => void;
}

const SourcingCycle: React.FC<SourcingCycleProps> = ({ activeStepId, onStepClick }) => {
  // Cycle visualization logic
  // Using a square aspect ratio for better centering in the 50% column
  const width = 600;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Adjusted radii to fit text inside
  const outerRadius = 240; // The dotted line and nodes
  const textRadius = 160;  // Text is slightly closer to the ring
  
  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto select-none">
      {/* Central Logo/Icon */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="bg-primary-500 text-white w-28 h-28 rounded-[2rem] shadow-xl transform rotate-[-15deg] flex items-center justify-center flex-col z-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">Sourcing</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-sm">
        {/* Dotted Circle Track */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={outerRadius} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth="3" 
          strokeDasharray="10 10" 
        />

        {STEPS.map((step, index) => {
          const totalSteps = STEPS.length;
          // Offset angle to start at top-right (match typical cycle flow)
          const angleDeg = (index * (360 / totalSteps)) - 90 + (360/totalSteps); 
          const angleRad = (angleDeg * Math.PI) / 180;
          
          // Node Position (Outer ring)
          const nodeX = centerX + outerRadius * Math.cos(angleRad);
          const nodeY = centerY + outerRadius * Math.sin(angleRad);

          // Text Position (Inner ring)
          const textX = centerX + textRadius * Math.cos(angleRad);
          const textY = centerY + textRadius * Math.sin(angleRad);

          const isActive = activeStepId === step.id;

          return (
            <g 
              key={step.id} 
              onClick={() => onStepClick(step.id)}
              className="cursor-pointer transition-all duration-300 group"
            >
              {/* Connector Line (from center area to node) - Optional visual aid */}
              <line 
                x1={centerX + 60 * Math.cos(angleRad)} 
                y1={centerY + 60 * Math.sin(angleRad)}
                x2={nodeX}
                y2={nodeY}
                stroke={isActive ? '#fdf5f3' : 'transparent'}
                strokeWidth="24"
                strokeLinecap="round"
                className="transition-colors duration-300"
              />

              {/* Node Circle */}
              <circle
                cx={nodeX}
                cy={nodeY}
                r={isActive ? 36 : 28}
                className={`transition-all duration-300 ${isActive ? 'fill-primary-500 stroke-primary-200' : 'fill-white stroke-primary-200 group-hover:stroke-primary-400 group-hover:fill-primary-50'}`}
                strokeWidth={isActive ? 8 : 3}
              />
              
              {/* Step Number inside Node */}
              <text
                x={nodeX}
                y={nodeY}
                dy="0.35em"
                textAnchor="middle"
                className={`text-xl font-bold transition-all duration-300 ${isActive ? 'fill-white' : 'fill-primary-400'}`}
              >
                {step.id}
              </text>

              {/* Label Inside the Circle */}
              <foreignObject
                x={textX - 75} // Centered on the textRadius point (150 width / 2)
                y={textY - 35}
                width="150" 
                height="70"
                className="overflow-visible pointer-events-none"
              >
                <div className={`
                  flex flex-col items-center justify-center h-full text-center
                  transition-transform duration-300
                  ${isActive ? 'scale-110' : 'scale-100'}
                `}>
                  <span className={`
                    text-sm font-bold leading-tight px-3 py-1.5 rounded-xl
                    ${isActive ? 'text-primary-800 bg-primary-50/95 shadow-md backdrop-blur-sm border border-primary-100' : 'text-slate-600 group-hover:text-primary-600 bg-white/50 group-hover:bg-white/80'}
                  `}>
                    {step.title}
                  </span>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SourcingCycle;