import React, { useState, useEffect } from 'react';
import { ContentEvaluationOutput, ResultsAnalysisOutput, CompetitorAnalysisOutput } from '../types';
import { evaluateAndOptimizeContent, analyzeResults, analyzeConfidentialText, analyzeCompetitors } from '../services/lucresiaService';

// Icons
const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 5 13"></polyline></svg>;
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const XRayIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16.23 7.77-2.46 2.46" /><path d="m19.5 4.5-2.46 2.46" /><path d="M12.23 11.77 9.77 14.23" /><path d="m2 21 6-6" /><path d="M12 21v-3" /><path d="M12 14v-3" /><path d="m18 3-4 4h3v3l4-4Z" /><path d="M21 12h-3" /><path d="M14 12h-3" /><path d="M2 12h3" /><path d="M3 18l4-4v3h3l-4 4Z" /></svg>;
const AnalyticsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><rect x="7" y="12" width="4" height="6" /><rect x="13" y="8" width="4" height="10" /><rect x="19" y="4" width="4" height="14" /></svg>;
const InsightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.22 5.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L5.22 6.28a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM14.78 14.78a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM12.28 14.78a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM7.72 5.22a.75.75 0 010 1.06L6.66 7.34a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 18z" /><path d="M10 7a3 3 0 100 6 3 3 0 000-6z" /></svg>;
const RecommendationIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const RadarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 0 0 3.34 17"/><path d="M20.66 17A10 10 0 0 0 17.38 4"/><path d="M12 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="M14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/><path d="M12 12h.01"/></svg>;
const MicIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const LayersIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;

// Main Hub Component
const HubDeAnaliseView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'avaliador' | 'resultados' | 'sensorial'>('avaliador');
    
    // Show welcome message
    useEffect(() => {
        if (window.Lucresia) {
            window.Lucresia.showWelcome('hub-de-analise', 'HUB de Análise');
        }
    }, []);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'avaliador': return <AvaliadorDeConteudoViewInternal />;
            case 'resultados': return <AnalisadorDeResultadosViewInternal />;
            case 'sensorial': return <AnalisadorSensorialViewInternal />;
            default: return null;
        }
    };
    
    const tabs = [
        { id: 'avaliador', label: 'Avaliador de Conteúdo' },
        { id: 'resultados', label: 'Analisador de Resultados' },
        { id: 'sensorial', label: 'Analisador Sensorial' }
    ];

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 md:p-6 border-b border-brand-lavender/50 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl md:text-2xl font-serif-display">HUB de Análise</h1>
                    <p className="text-gray-500 text-sm">Seu centro de comando para otimização e estratégia de conteúdo.</p>
                </div>
                 <div className="mt-4 border-b border-brand-lavender/50">
                    <div className="flex items-center gap-2">
                        {tabs.map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-brand-dark-purple border-b-2 border-brand-lilac' : 'text-gray-500 hover:text-brand-dark-purple'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                {renderActiveTab()}
            </main>
        </div>
    );
}

// --- Internal Tab Components ---

const AvaliadorDeConteudoViewInternal: React.FC = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ContentEvaluationOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleEvaluate = async () => {
        if (!content.trim()) {
            setError("Por favor, insira o conteúdo que deseja avaliar.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const evaluation = await evaluateAndOptimizeContent(content);
            setResult(evaluation);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.versaoOtimizada) {
            navigator.clipboard.writeText(result.versaoOtimizada);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const ScoreCard: React.FC<{ title: string; score: number; feedback: string }> = ({ title, score, feedback }) => {
        const getScoreColor = (s: number) => {
            if (s >= 85) return 'text-green-500 border-green-500';
            if (s >= 60) return 'text-yellow-500 border-yellow-500';
            return 'text-red-500 border-red-500';
        };

        return (
            <div className="bg-white p-4 rounded-lg border border-brand-lavender/50 shadow-sm flex items-start gap-4">
                <div className={`w-16 h-16 rounded-full border-4 flex-shrink-0 flex items-center justify-center ${getScoreColor(score)}`}>
                    <span className={`text-2xl font-bold ${getScoreColor(score).split(' ')[0]}`}>{score}</span>
                </div>
                <div>
                    <h4 className="font-semibold">{title}</h4>
                    <p className="text-xs text-gray-600">{feedback}</p>
                </div>
            </div>
        );
    };

     return (
        <div className="h-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
                 <div>
                    <label htmlFor="content-input" className="text-sm font-medium text-gray-700 block mb-1">Conteúdo para Avaliar</label>
                    <textarea 
                        id="content-input"
                        rows={15}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple text-sm leading-relaxed"
                        placeholder="Cole aqui o conteúdo que você deseja elevar..."
                    />
                </div>
                 <div className="mt-auto pt-6">
                    <button 
                        onClick={handleEvaluate}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-brand-dark-purple text-white rounded-md font-semibold hover:bg-brand-dark-purple/90 disabled:bg-gray-400 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <SpinnerIcon /> : 'Avaliar Conteúdo'}
                    </button>
                </div>
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col bg-brand-lavender/10 overflow-hidden">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                         <div className="w-16 h-16 bg-brand-lavender/50 rounded-full flex items-center justify-center mb-6">
                            <XRayIcon className="w-8 h-8 text-brand-dark-purple" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Analisando...</h2>
                    </div>
                )}
                 {result && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-serif-display mb-4">Análise Flow Prime™</h2>
                        <div className="space-y-4 mb-6">
                           <ScoreCard title="Clareza" score={result.notas.clareza} feedback={result.feedback.clareza} />
                           <ScoreCard title="Conexão" score={result.notas.conexao} feedback={result.feedback.conexao} />
                           <ScoreCard title="Conversão" score={result.notas.conversao} feedback={result.feedback.conversao} />
                        </div>
                        <div className="flex-1 flex flex-col min-h-0">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-serif-display">Versão Otimizada</h3>
                                <button onClick={handleCopy} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                                    {copied ? <CheckIcon/> : <CopyIcon/>}
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <textarea 
                                readOnly
                                value={result.versaoOtimizada}
                                className="w-full p-3 border border-brand-lavender/50 bg-white rounded-md text-sm leading-relaxed flex-1"
                            />
                             <div className="mt-4 bg-brand-gold/10 p-3 rounded-lg flex-shrink-0">
                                <p className="font-serif-display text-base text-brand-gold">Mentoria Rápida 🧠</p>
                                <p className="text-xs text-brand-graphite mt-1">{result.mentoriaRapida}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AnalisadorDeResultadosViewInternal: React.FC = () => {
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
        metrics: "Cole os resultados da sua última campanha. Seja específica. Ex: Post 'Lançamento Pele de Seda' (últimos 7 dias): Alcance: 3.500; Salvamentos: 112; Comentários: 23; Leads via DM: 8. Quanto mais detalhes, mais profundos serão os insights.",
        confidential: "Cole aqui uma conversa real com uma cliente (remova dados pessoais). Ex: 'Eu adorei o resultado, mas tenho medo que não dure muito...' ou 'Qual a diferença desse tratamento para o outro?'. A LucresIA identificará as dores e desejos ocultos para você criar conteúdos que vendem mais."
    };
    
    const handleTabChange = (tab: 'metrics' | 'confidential') => {
        setActiveTab(tab);
        setInputText('');
        setResult(null);
        setError(null);
    }


    return (
        <div className="h-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
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

const AnalisadorSensorialViewInternal: React.FC = () => {
    const [profiles, setProfiles] = useState(['', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CompetitorAnalysisOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProfileChange = (index: number, value: string) => {
        const newProfiles = [...profiles];
        newProfiles[index] = value;
        setProfiles(newProfiles);
    };

    const handleAnalyze = async () => {
        const validProfiles = profiles.filter(p => p.trim() !== '');
        if (validProfiles.length === 0) {
            setError("Por favor, insira pelo menos um perfil para análise.");
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const analysis = await analyzeCompetitors(validProfiles);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
                 <div>
                    <label htmlFor="profiles-input" className="text-sm font-medium text-gray-700 block mb-1">
                        Perfis de Concorrentes ou Inspiração
                    </label>
                    <div className="space-y-2">
                        {profiles.map((profile, index) => (
                            <input
                                key={index}
                                type="text"
                                value={profile}
                                onChange={(e) => handleProfileChange(index, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple text-sm"
                                placeholder={index === 0 ? "@concorrente_direta" : index === 1 ? "@outra_concorrente" : "@marca_inspiracao"}
                            />
                        ))}
                    </div>
                     <p className="text-xs text-gray-500 mt-2">Dica: escolha perfis que atuam no mesmo nicho que você, sejam eles concorrentes diretos ou marcas que te inspiram para que a análise seja mais precisa.</p>
                </div>

                 <div className="mt-auto pt-6">
                    <button 
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-brand-dark-purple text-white rounded-md font-semibold hover:bg-brand-dark-purple/90 disabled:bg-gray-400 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <SpinnerIcon /> : 'Analisar Mercado'}
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                </div>
            </div>
            <div className="w-full md:w-2/3 p-6 flex flex-col bg-brand-lavender/10 overflow-hidden">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                         <div className="w-16 h-16 bg-brand-lavender/50 rounded-full flex items-center justify-center mb-6">
                            <RadarIcon className="w-8 h-8 text-brand-dark-purple" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Mapeando o mercado...</h2>
                        <p className="text-gray-500 max-w-xs">A LucresIA está fazendo uma leitura sensorial da sua concorrência.</p>
                    </div>
                )}
                 {result && (
                    <div className="flex flex-col h-full">
                        <h2 className="text-xl font-serif-display mb-6">Análise de Mercado</h2>
                        <div className="flex-1 space-y-8 overflow-y-auto pr-2 -mr-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-4 text-brand-dark-purple">
                                    Raio-X dos Concorrentes
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {result.analysis.map((item, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl border border-brand-lavender/50 shadow-sm flex flex-col gap-4">
                                            <h4 className="font-bold text-brand-soft-black text-center pb-2 border-b border-brand-lavender/30">{item.profile}</h4>
                                            <div className="space-y-1">
                                                <h5 className="flex items-center gap-2 text-sm font-semibold text-brand-dark-purple"><MicIcon className="w-4 h-4" /> Tom de Voz</h5>
                                                <p className="text-sm text-brand-graphite pl-6">{item.toneOfVoice}</p>
                                            </div>
                                             <div className="space-y-1">
                                                <h5 className="flex items-center gap-2 text-sm font-semibold text-brand-dark-purple"><EyeIcon className="w-4 h-4" /> Estratégia Visual</h5>
                                                <p className="text-sm text-brand-graphite pl-6">{item.visualStrategy}</p>
                                            </div>
                                             <div className="space-y-1">
                                                <h5 className="flex items-center gap-2 text-sm font-semibold text-brand-dark-purple"><LayersIcon className="w-4 h-4" /> Pilar Principal</h5>
                                                <p className="text-sm text-brand-graphite pl-6">{item.contentPillar}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-gold-gradient text-white shadow-2xl shadow-brand-gold/30">
                                <h3 className="font-serif-display text-2xl flex items-center gap-3 mb-3">
                                    <span className="text-3xl">💎</span>
                                    Sua Oportunidade Única
                                </h3>
                                <p className="text-white/90 font-medium leading-relaxed">{result.opportunity}</p>
                            </div>
                        </div>
                    </div>
                )}
                 {!isLoading && !result && !error && (
                    <div className="flex flex-col items-center justify-center text-center h-full text-gray-500">
                        <p className="text-lg font-semibold">O mercado fala. Vamos ouvir?</p>
                        <p className="max-w-xs mt-1">Insira os perfis que deseja analisar para descobrir o seu espaço único e inexplorado no mercado da estética.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export default HubDeAnaliseView;