

import React, { useState } from 'react';
import { PautaOutput } from '../types';
import { generatePautaContent } from '../services/lucresiaService';

// Icons
const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;
const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 5 13"></polyline></svg>;
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;


const GeradorDePautasView: React.FC = () => {
    const [theme, setTheme] = useState('');
    const [toneOfVoice, setToneOfVoice] = useState<'Vendas Premium' | 'Acolhedora Clínica' | 'Científica Didática'>('Vendas Premium');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState<PautaOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!theme.trim()) {
            setError("Por favor, insira um tema para gerar o conteúdo.");
            return;
        }
        setIsLoading(true);
        setOutput(null);
        setError(null);
        try {
            const result = await generatePautaContent(theme, toneOfVoice);
            setOutput(result);
            setActiveTab('carrossel');
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    
    const tabs = output ? [
        { id: 'carrossel', label: 'Carrossel' },
        { id: 'legenda', label: 'Legenda' },
        { id: 'reels', label: 'Reels' },
        { id: 'gmn', label: 'Google Meu Negócio' },
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'email', label: 'E-mail' }
    ] : [];

    return (
        <div className="h-full flex flex-col md:flex-row">
            {/* Left Panel: Inputs */}
            <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto border-b md:border-b-0 md:border-r border-brand-lavender/50 bg-white">
                <header>
                    <h1 className="text-2xl font-serif-display">Gerador de Pautas</h1>
                    <p className="text-gray-500 mt-1">Transforme um tema em uma campanha completa com o tom de voz da sua marca.</p>
                </header>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="theme" className="text-sm font-medium text-gray-700 block mb-1">Pauta / Tema</label>
                        <textarea 
                            id="theme"
                            rows={5}
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple text-sm"
                            placeholder="Ex: Lançamento do novo protocolo 'Pele de Seda', focado em hidratação profunda com ácido hialurônico."
                        />
                    </div>
                    <div>
                        <label htmlFor="tone" className="text-sm font-medium text-gray-700 block mb-1">Tom de Voz</label>
                        <select
                            id="tone"
                            value={toneOfVoice}
                            onChange={(e) => setToneOfVoice(e.target.value as any)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple text-sm"
                        >
                            <option value="Vendas Premium">Vendas Premium</option>
                            <option value="Acolhedora Clínica">Acolhedora Clínica</option>
                            <option value="Científica Didática">Científica Didática</option>
                        </select>
                    </div>
                </div>
                 <div className="mt-auto pt-6">
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-brand-dark-purple text-white rounded-md font-semibold hover:bg-brand-dark-purple/90 disabled:bg-gray-400 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <SpinnerIcon /> : 'Gerar Conteúdo'}
                    </button>
                    {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                </div>
            </div>
            {/* Right Panel: Output */}
            <div className="w-full md:w-2/3 p-6 flex flex-col bg-brand-lavender/10 overflow-hidden">
                {!output && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center text-center h-full text-gray-500">
                        <p className="text-lg">Seu conteúdo aparecerá aqui.</p>
                        <p className="max-w-xs">Preencha o tema e o tom de voz para começar a mágica.</p>
                    </div>
                )}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className="w-16 h-16 bg-brand-lavender/50 rounded-full flex items-center justify-center mb-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-dark-purple"></div>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Gerando sua campanha...</h2>
                        <p className="text-gray-500 max-w-xs">Aguarde, a LucresIA está orquestrando as melhores estratégias para você.</p>
                    </div>
                )}
                {output && (
                    <>
                        <div className="border-b border-brand-lavender/50 -mx-6 px-6 overflow-x-auto">
                            <div className="flex items-center gap-2">
                                {tabs.map(tab => (
                                    <button 
                                        key={tab.id} 
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-brand-dark-purple border-b-2 border-brand-lilac' : 'text-gray-500 hover:text-brand-dark-purple'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 mt-6 overflow-y-auto pr-2 -mr-4">
                            {activeTab === 'carrossel' && (
                                <div className="bg-white rounded-lg p-4 border border-brand-lavender/50 shadow-sm">
                                    <h3 className="font-semibold mb-2">Slides do Carrossel</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        {output.carrossel.map((slide, index) => <li key={index}>{slide}</li>)}
                                    </ol>
                                </div>
                            )}
                             {activeTab === 'legenda' && (
                                <div className="bg-white rounded-lg p-4 border border-brand-lavender/50 shadow-sm relative group">
                                    <button onClick={() => handleCopy(output.legenda, 'legenda')} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {copiedId === 'legenda' ? <CheckIcon/> : <CopyIcon/>}
                                    </button>
                                    <p className="text-sm whitespace-pre-wrap">{output.legenda}</p>
                                    {output.mentoriaRapida && (
                                        <div className="mt-4 bg-brand-gold/10 p-3 rounded-lg">
                                            <p className="font-serif-display text-base text-brand-gold">Mentoria Rápida 🧠</p>
                                            <p className="text-xs text-brand-graphite mt-1">{output.mentoriaRapida}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                             {activeTab === 'reels' && (
                                <div className="bg-white rounded-lg p-4 border border-brand-lavender/50 shadow-sm relative group">
                                    <button onClick={() => handleCopy(output.reels, 'reels')} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                         {copiedId === 'reels' ? <CheckIcon/> : <CopyIcon/>}
                                    </button>
                                    <p className="text-sm whitespace-pre-wrap">{output.reels}</p>
                                </div>
                            )}
                            {activeTab === 'gmn' && (
                                <div className="bg-white rounded-lg p-4 border border-brand-lavender/50 shadow-sm relative group">
                                     <button onClick={() => handleCopy(output.googleMeuNegocio, 'gmn')} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                         {copiedId === 'gmn' ? <CheckIcon/> : <CopyIcon/>}
                                    </button>
                                    <p className="text-sm whitespace-pre-wrap">{output.googleMeuNegocio}</p>
                                </div>
                            )}
                            {activeTab === 'whatsapp' && (
                                <div className="bg-white rounded-lg p-4 border border-brand-lavender/50 shadow-sm relative group">
                                     <button onClick={() => handleCopy(output.whatsapp, 'whatsapp')} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                         {copiedId === 'whatsapp' ? <CheckIcon/> : <CopyIcon/>}
                                    </button>
                                    <p className="text-sm whitespace-pre-wrap">{output.whatsapp}</p>
                                </div>
                            )}
                            {activeTab === 'email' && (
                                <div className="bg-white rounded-lg p-4 border border-brand-lavender/50 shadow-sm relative group">
                                     <button onClick={() => handleCopy(`Assunto: ${output.email.assunto}\n\n${output.email.corpo}`, 'email')} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                         {copiedId === 'email' ? <CheckIcon/> : <CopyIcon/>}
                                    </button>
                                    <h4 className="font-semibold text-sm">Assunto: <span className="font-normal">{output.email.assunto}</span></h4>
                                    <hr className="my-2"/>
                                    <p className="text-sm whitespace-pre-wrap">{output.email.corpo}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GeradorDePautasView;