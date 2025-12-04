import React, { useState, useEffect } from 'react';
import { ContentSuggestion, FullPostPackage, ScheduledPost } from '../types';
import { generateFullPostFromSuggestion } from '../services/lucresiaService';

interface PilotoAutomaticoModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: ContentSuggestion | null;
  onSavePost: (post: Partial<ScheduledPost>) => void;
}

const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 5 13"></polyline></svg>;

const PilotoAutomaticoModal: React.FC<PilotoAutomaticoModalProps> = ({ isOpen, onClose, suggestion, onSavePost }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<FullPostPackage | null>(null);
  const [activeTab, setActiveTab] = useState<string>('main');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when modal opens or suggestion changes
    if (isOpen) {
      setOutput(null);
      setIsGenerating(false);
      setActiveTab('main');
    }
  }, [isOpen, suggestion]);

  if (!isOpen || !suggestion) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setOutput(null);
    try {
        const result = await generateFullPostFromSuggestion(suggestion.prompt);
        setOutput(result);
        setActiveTab('main');
    } catch (error) {
        console.error("Error in Piloto Automático:", error);
    } finally {
        setIsGenerating(false);
    }
  };
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToCalendar = () => {
    if (output) {
      const newPost: Partial<ScheduledPost> = {
        title: suggestion.title,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), suggestion.day).toISOString().split('T')[0],
        status: 'Rascunho',
        content: output.mainCaption,
      };
      onSavePost(newPost);
      onClose();
    }
  };

  const renderContent = () => {
    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark-purple"></div>
                <p className="mt-4 text-gray-600">Criando seu post completo...</p>
            </div>
        );
    }

    if (output) {
        const tabs = [{id: 'main', label: 'Legenda Principal'}, ...output.variations.map((v, i) => ({id: `var${i}`, label: v.name}))];
        const activeContent = activeTab === 'main' ? output.mainCaption : output.variations.find((v,i) => `var${i}` === activeTab)?.caption || '';
        const copyId = activeTab;

        return (
            <div className="flex h-full">
                <div className="w-2/3 p-6 flex flex-col border-r border-gray-200">
                    <div className="border-b border-gray-200 mb-4 flex items-center gap-2">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-sm font-medium px-3 py-1.5 border-b-2 ${activeTab === tab.id ? 'border-brand-dark-purple text-brand-dark-purple' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex-1">
                        <textarea readOnly value={activeContent} className="w-full h-full resize-none border-0 p-0 focus:ring-0 text-sm leading-relaxed bg-transparent" />
                        <button onClick={() => handleCopy(activeContent, copyId)} className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-700">
                             {copiedId === copyId ? <CheckIcon/> : <CopyIcon/>}
                        </button>
                    </div>
                </div>
                <div className="w-1/3 p-6 bg-gray-50 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Sugestões de Mídia</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                                {output.mediaSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm mb-2">Hashtags</h4>
                            <div className="flex flex-wrap gap-1">
                                {output.hashtags.map((h, i) => <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{h}</span>)}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm mb-2">Checklist de Postagem</h4>
                            <ul className="space-y-2">
                                {output.checklist.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                        <input type="checkbox" className="rounded text-brand-dark-purple focus:ring-brand-lilac" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">{suggestion.prompt}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-100 p-3 rounded-lg"><strong>Formato:</strong> {suggestion.format}</div>
                    <div className="bg-gray-100 p-3 rounded-lg"><strong>Funil:</strong> {suggestion.funnelStage}</div>
                    <div className="bg-gray-100 p-3 rounded-lg"><strong>Gatilho:</strong> {suggestion.salesTrigger}</div>
                    <div className="bg-gray-100 p-3 rounded-lg"><strong>Pilar:</strong> {suggestion.category}</div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-serif-display font-semibold">Piloto Automático de Conteúdo ✨</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700">&times;</button>
        </header>
        <main className="flex-1 overflow-y-auto">
            {renderContent()}
        </main>
        <footer className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                Fechar
            </button>
            {output ? (
                 <button onClick={handleSaveToCalendar} className="px-4 py-2 bg-brand-gold text-white rounded-md text-sm font-medium hover:bg-brand-gold/80">
                    Salvar no Calendário
                </button>
            ) : (
                <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 disabled:bg-gray-400">
                    {isGenerating ? 'Gerando...' : 'Gerar Post Completo'}
                </button>
            )}
        </footer>
      </div>
    </div>
  );
};

export default PilotoAutomaticoModal;