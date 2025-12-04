
import React, { useState } from 'react';
import { CompetitorAnalysisOutput } from '../types';
import { analyzeCompetitors } from '../services/lucresiaService';

// Icons
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const RadarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 0 0 3.34 17"/><path d="M20.66 17A10 10 0 0 0 17.38 4"/><path d="M12 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="M14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/><path d="M12 12h.01"/></svg>;
const MicIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const LayersIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;


const AnalisadorSensorialView: React.FC = () => {
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
            {/* Left Panel: Input */}
            <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
                 <header>
                    <h1 className="text-2xl font-serif-display">Analisador Sensorial</h1>
                    <p className="text-gray-500 mt-1">Entenda o mercado para se destacar. Analise seus concorrentes e descubra sua oportunidade única.</p>
                </header>

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
            {/* Right Panel: Output */}
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

export default AnalisadorSensorialView;
