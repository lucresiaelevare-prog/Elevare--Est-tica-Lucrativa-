
import React, { useState } from 'react';
import { ContentEvaluationOutput } from '../types';
import { evaluateAndOptimizeContent } from '../services/lucresiaService';

// Icons
const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 5 13"></polyline></svg>;
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const XRayIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16.23 7.77-2.46 2.46" /><path d="m19.5 4.5-2.46 2.46" /><path d="M12.23 11.77 9.77 14.23" /><path d="m2 21 6-6" /><path d="M12 21v-3" /><path d="M12 14v-3" /><path d="m18 3-4 4h3v3l4-4Z" /><path d="M21 12h-3" /><path d="M14 12h-3" /><path d="M2 12h3" /><path d="M3 18l4-4v3h3l-4 4Z" /></svg>;

const ScoreCard: React.FC<{ title: string; score: number; feedback: string }> = ({ title, score, feedback }) => {
    const getScoreColor = (s: number) => {
        if (s >= 85) return 'text-green-500 border-green-500';
        if (s >= 60) return 'text-yellow-500 border-yellow-500';
        return 'text-red-500 border-red-500';
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-brand-lavender/50 shadow-sm flex items-center gap-4">
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


const AvaliadorDeConteudoView: React.FC = () => {
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

    return (
        <div className="h-full flex flex-col md:flex-row">
            {/* Left Panel: Input */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
                 <header>
                    <h1 className="text-2xl font-serif-display">Avaliador de Conteúdo</h1>
                    <p className="text-gray-500 mt-1">Receba uma nota e uma versão otimizada do seu texto pela LucresIA.</p>
                </header>
                 <div>
                    <label htmlFor="content-input" className="text-sm font-medium text-gray-700 block mb-1">Conteúdo para Avaliar</label>
                    <textarea 
                        id="content-input"
                        rows={15}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple text-sm leading-relaxed"
                        placeholder="Cole aqui o conteúdo que você deseja elevar. Exemplo:

'Estamos com uma promoção imperdível no nosso tratamento de criomodelagem! Agende já sua avaliação.'

Quanto mais real o seu texto, mais precisa será a análise e otimização da LucresIA. Vamos transformar essa comunicação juntas."
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
            {/* Right Panel: Output */}
            <div className="w-full md:w-1/2 p-6 flex flex-col bg-brand-lavender/10 overflow-hidden">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                         <div className="w-16 h-16 bg-brand-lavender/50 rounded-full flex items-center justify-center mb-6">
                            <XRayIcon className="w-8 h-8 text-brand-dark-purple" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Analisando seu conteúdo...</h2>
                        <p className="text-gray-500 max-w-xs">A LucresIA está aplicando o Raio-X de Marketing no seu texto.</p>
                    </div>
                )}
                 {error && (
                    <div className="flex items-center justify-center h-full text-center text-red-500">
                        <p>{error}</p>
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
                        <div className="flex-1 flex flex-col">
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-serif-display">Versão Otimizada (3F)</h3>
                                <button onClick={handleCopy} className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5">
                                    {copied ? <CheckIcon/> : <CopyIcon/>}
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            </div>
                            <textarea 
                                readOnly
                                value={result.versaoOtimizada}
                                rows={10}
                                className="w-full p-3 border border-brand-lavender/50 bg-white rounded-md text-sm leading-relaxed flex-1"
                            />
                             <div className="mt-4 bg-brand-gold/10 p-3 rounded-lg">
                                <p className="font-serif-display text-base text-brand-gold">Mentoria Rápida 🧠</p>
                                <p className="text-xs text-brand-graphite mt-1">{result.mentoriaRapida}</p>
                            </div>
                        </div>
                    </div>
                )}
                 {!isLoading && !result && !error && (
                    <div className="flex flex-col items-center justify-center text-center h-full text-gray-500">
                        <p className="text-lg font-semibold">Pronta para transformar seu texto?</p>
                        <p className="max-w-xs mt-1">Cole seu conteúdo no painel à esquerda e receba uma análise completa e uma versão otimizada com a metodologia Flow Prime™.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvaliadorDeConteudoView;
