
import React, { useState } from 'react';
import { ResultsAnalysisOutput } from '../types';
import { analyzeResults, analyzeConfidentialText } from '../services/lucresiaService';

// Icons
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const AnalyticsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><rect x="7" y="12" width="4" height="6" /><rect x="13" y="8" width="4" height="10" /><rect x="19" y="4" width="4" height="14" /></svg>;
const InsightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.22 5.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L5.22 6.28a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM14.78 14.78a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM12.28 14.78a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM7.72 5.22a.75.75 0 010 1.06L6.66 7.34a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 18z" /><path d="M10 7a3 3 0 100 6 3 3 0 000-6z" /></svg>;
const RecommendationIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;


const AnalisadorDeResultadosView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'metrics' | 'confidential'>('metrics');
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ResultsAnalysisOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            setError("Por favor, insira os dados para análise.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const analysis = activeTab === 'metrics'
                ? await analyzeResults(inputText)
                : await analyzeConfidentialText(inputText);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const placeholders = {
        metrics: "Cole aqui suas métricas de engajamento. Ex: Post 'Pele de Seda': 150 curtidas, 80 salvamentos, 20 comentários, 12 leads...",
        confidential: "Cole aqui conversas de WhatsApp, DMs ou anotações sobre suas clientes para extrair dores, desejos e objeções..."
    };
    
    const handleTabChange = (tab: 'metrics' | 'confidential') => {
        setActiveTab(tab);
        setInputText('');
        setResult(null);
        setError(null);
    }


    return (
        <div className="h-full flex flex-col md:flex-row">
            {/* Left Panel: Input */}
            <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
                 <header>
                    <h1 className="text-2xl font-serif-display">Analisador de Resultados</h1>
                    <p className="text-gray-500 mt-1">Transforme dados em decisões. Cole suas métricas e receba insights estratégicos.</p>
                </header>

                <div className="flex border-b border-gray-200">
                    <button onClick={() => handleTabChange('metrics')} className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'metrics' ? 'border-b-2 border-brand-dark-purple text-brand-dark-purple' : 'text-gray-500'}`}>Análise de Métricas</button>
                    <button onClick={() => handleTabChange('confidential')} className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'confidential' ? 'border-b-2 border-brand-dark-purple text-brand-dark-purple' : 'text-gray-500'}`}>Análise Confidencial</button>
                </div>

                 <div>
                    <label htmlFor="metrics-input" className="text-sm font-medium text-gray-700 block mb-1">
                        {activeTab === 'metrics' ? 'Resultados e Métricas' : 'Texto Confidencial'}
                    </label>
                    <textarea 
                        id="metrics-input"
                        rows={15}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple text-sm leading-relaxed"
                        placeholder={placeholders[activeTab]}
                    />
                    {activeTab === 'confidential' && (
                        <p className="text-xs text-gray-500 mt-2">🔒 Esta análise simula o processamento no seu dispositivo para garantir total privacidade. Seus dados não são armazenados.</p>
                    )}
                </div>
                 <div className="mt-auto pt-6">
                    <button 
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-brand-dark-purple text-white rounded-md font-semibold hover:bg-brand-dark-purple/90 disabled:bg-gray-400 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <SpinnerIcon /> : 'Analisar Resultados'}
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                </div>
            </div>
            {/* Right Panel: Output */}
            <div className="w-full md:w-2/3 p-6 flex flex-col bg-brand-lavender/10 overflow-hidden">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                         <div className="w-16 h-16 bg-brand-lavender/50 rounded-full flex items-center justify-center mb-6">
                            <AnalyticsIcon className="w-8 h-8 text-brand-dark-purple" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Analisando seus dados...</h2>
                        <p className="text-gray-500 max-w-xs">A LucresIA está processando suas métricas para encontrar os melhores insights.</p>
                    </div>
                )}
                 {result && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-serif-display mb-6">Análise Estratégica</h2>
                        <div className="flex-1 space-y-8 overflow-y-auto pr-2 -mr-4">
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2 mb-3 text-brand-dark-purple">
                                    <InsightIcon />
                                    Insights Acionáveis
                                </h3>
                                <ul className="space-y-3">
                                    {result.insights.map((insight, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-brand-gold mt-1">✨</span>
                                            <p className="text-sm text-brand-graphite">{insight}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2 mb-3 text-brand-dark-purple">
                                    <RecommendationIcon />
                                    Recomendações de Conteúdo
                                </h3>
                                <ul className="space-y-3">
                                    {result.recommendations.map((rec, index) => (
                                         <li key={index} className="flex items-start gap-3">
                                            <span className="text-brand-gold mt-1">💡</span>
                                            <p className="text-sm text-brand-graphite">{rec}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                 {!isLoading && !result && !error && (
                    <div className="flex flex-col items-center justify-center text-center h-full text-gray-500">
                        <p className="text-lg">Sua análise aparecerá aqui.</p>
                        <p className="max-w-xs">Cole suas métricas ou textos no painel à esquerda para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalisadorDeResultadosView;
