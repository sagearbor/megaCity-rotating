import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { AIAnalysisResult } from '../types';

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AIAnalysisResult | null;
    isLoading: boolean;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, data, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        AI Analysis
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 text-sm animate-pulse">Consulting Architectural Matrix...</p>
                        </div>
                    ) : data ? (
                        <div className="prose prose-invert prose-sm">
                            <h4 className="text-sky-400 font-bold text-lg mb-2">{data.title}</h4>
                            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                                {data.content}
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400">No data available.</p>
                    )}
                </div>
                
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
