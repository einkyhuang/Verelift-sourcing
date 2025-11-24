import React, { useState } from 'react';
import { ProcessStep } from '../types';

interface ContentPanelProps {
  step: ProcessStep;
  content: string;
  loading: boolean;
  onRefresh: () => void;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ step, content, loading }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  // Convert the Markdown-like content to clean HTML for WordPress
  const getHtmlForWordpress = () => {
    const lines = content.split('\n');
    let html = `<!-- Sourcing Step: ${step.title} -->\n<div class="sourcing-guide-step" style="font-family: sans-serif; max-width: 800px;">\n`;
    html += `  <h2 style="color: #e6573d; font-weight: bold; font-size: 28px; margin-bottom: 20px; line-height: 1.3;">Step ${step.id}: ${step.title}</h2>\n`;
    html += `  <p style="font-style: italic; color: #64748b; font-size: 18px; margin-bottom: 30px;">${step.shortDescription}</p>\n`;
    html += `  <hr style="border: 0; border-top: 2px solid #e2e8f0; margin-bottom: 30px;" />\n`;
    
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('###')) {
        if (inList) { html += '  </ul>\n'; inList = false; }
        html += `  <h3 style="color: #b33a24; font-weight: bold; font-size: 22px; margin-top: 30px; margin-bottom: 15px;">${trimmed.replace(/###\s*/, '')}</h3>\n`;
      } else if (trimmed.startsWith('-')) {
        if (!inList) { html += '  <ul style="list-style-type: disc; margin-left: 24px; color: #334155; margin-bottom: 24px; font-size: 16px;">\n'; inList = true; }
        let itemText = trimmed.replace(/-\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `    <li style="margin-bottom: 10px; line-height: 1.6;">${itemText}</li>\n`;
      } else {
        if (inList) { html += '  </ul>\n'; inList = false; }
        let pText = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html += `  <p style="margin-bottom: 20px; line-height: 1.7; color: #334155; font-size: 16px;">${pText}</p>\n`;
      }
    });

    if (inList) { html += '  </ul>\n'; }
    html += `</div>`;
    return html;
  };

  const handleCopyHtml = async () => {
    if (!content) return;
    const html = getHtmlForWordpress();
    try {
      await navigator.clipboard.writeText(html);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    // Removed rounded corners and shadow here because the parent App container now provides the "Widget Frame"
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-primary-500 p-8 text-white flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 font-bold text-lg">
              {step.id}
            </span>
            <h2 className="text-3xl font-bold">{step.title}</h2>
          </div>
          <p className="mt-3 text-primary-50 text-lg opacity-90">{step.shortDescription}</p>
        </div>
        <div className="text-5xl opacity-20 filter grayscale hidden sm:block">
          {step.icon}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 animate-pulse font-medium text-lg">Consulting Expert AI for Forklift Specifics...</p>
          </div>
        ) : (
          <div className="prose prose-lg prose-slate max-w-none">
            <div className="whitespace-pre-wrap font-sans leading-relaxed text-base">
               {content.split('\n').map((line, idx) => {
                 if (line.trim().startsWith('###')) return <h3 key={idx} className="text-xl font-bold text-primary-700 mt-8 mb-4">{line.replace(/###\s*/, '')}</h3>
                 if (line.trim().startsWith('-')) {
                    const cleanLine = line.replace('-', '');
                    const parts = cleanLine.split(/\*\*(.*?)\*\*/g);
                    return (
                      <li key={idx} className="ml-5 list-disc marker:text-primary-500 mb-2 pl-1 text-base text-slate-700">
                        {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-900 font-semibold">{part}</strong> : part)}
                      </li>
                    );
                 }
                 if (line.trim().length > 0) {
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={idx} className="mb-4 text-base text-slate-700 leading-7">
                        {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-900 font-semibold">{part}</strong> : part)}
                      </p>
                    );
                 }
                 return null;
               })}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-6 bg-white border-t border-slate-200 flex justify-end items-center shrink-0">
        <button 
          onClick={handleCopyHtml}
          disabled={loading || !content}
          className={`px-8 py-3 text-base font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border shadow-sm
            ${copyStatus === 'copied' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-primary-500 text-white border-primary-600 hover:bg-primary-600 shadow-primary-200'
            } disabled:opacity-50 disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 disabled:shadow-none`}
          title="Copy content as clean HTML for WordPress"
        >
          {copyStatus === 'copied' ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Copy HTML Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ContentPanel;