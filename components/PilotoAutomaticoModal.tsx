import React, { useState, useEffect } from 'react';
import { AjustadoraOutput } from '../types';
import { executePilotoAutomatico } from '../services/geminiService';

interface PilotoAutomaticoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTheme?: string;
}

const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;

const PilotoAutomaticoModal: React.FC<PilotoAutomaticoModalProps> = ({ isOpen, onClose, initialTheme }) => {
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<AjustadoraOutput | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTheme) {
        setTheme(initialTheme);
    }
  }, [initialTheme]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    setIsGenerating(true);
    setOutput(null);
    try {
        const result = await executePilotoAutomatico(theme);
        setOutput(result);
        setActiveTab(Object.keys(result)[0] || null);
    } catch (error) {
        console.error("Error in Piloto Automático:", error);
        // Handle error state in UI
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  return (
    <div 
        className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-serif-display font-semibold">Piloto Automático ✨</h2>
            <p className="text-sm text-gray-500 mt-1">Descreva o tema do seu conteúdo, e a LucresIA criará um pacote completo para você.</p>
        </header>
        <main className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            <div>
                <label htmlFor="theme" className="text-sm font-medium text-gray-700">Tema Central do Conteúdo</label>
                <textarea 
                    id="theme" 
                    rows={3}
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple"
                    placeholder="Ex: Lançamento do protocolo 'Pele de Seda'"
                />
            </div>
            
            <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                        <p className="mt-4 text-gray-500">Orquestrando mentoras e gerando seu conteúdo...</p>
                    </div>
                ) : output ? (
                    <>
                        <div className="flex items-center border-b border-gray-200 flex-shrink-0 px-2">
                           {Object.keys(output).map(channel => (
                                <button key={channel} onClick={() => setActiveTab(channel)} className={`text-sm font-medium px-4 py-2 border-b-2 capitalize transition-colors ${activeTab === channel ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>{channel}</button>
                            ))}
                        </div>
                        <div className="p-4 overflow-y-auto">
                           {activeTab && output[activeTab] && output[activeTab].map(variation => {
                                const variationId = `${activeTab}-${variation.variant}`;
                                return (
                                     <div key={variationId} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-gray-800">Variante {variation.variant}</h3>
                                            <button 
                                                onClick={() => handleCopy(variation.text, variationId)} 
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors text-xs flex items-center gap-1"
                                                title="Copiar"
                                            >
                                                {copiedId === variationId ? 'Copiado!' : <CopyIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div className="prose prose-sm max-w-none prose-pre:bg-gray-100 prose-pre:text-gray-800">
                                            <p className="whitespace-pre-wrap">{variation.text}</p>
                                            <div className="mt-4 not-prose">
                                                <strong>CTA Sugerido:</strong> <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">{variation.cta}</span>
                                            </div>
                                            <div className="mt-4">
                                                <strong>Como usar:</strong>
                                                <ul className="list-disc pl-5">
                                                    {variation.how.map((step, i) => <li key={i}>{step}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                           })}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                        <p>Seu pacote de conteúdo aparecerá aqui.</p>
                    </div>
                )}
            </div>

        </main>
        <footer className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                Fechar
            </button>
            <button onClick={handleGenerate} disabled={isGenerating || !theme.trim()} className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 disabled:bg-gray-400">
                {isGenerating ? 'Gerando...' : 'Gerar Pacote de Conteúdo'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default PilotoAutomaticoModal;