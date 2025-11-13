
import React, { useState, useRef } from 'react';
import { AspectRatio } from '../types';
import { suggestImagePrompt, generateImage } from '../services/geminiService';

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
);

const SparkleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 3L8 21m-4-8l12-2m5-5l-2 12m-8-4l-8.5 4L3 10l4.5 3.5L12 5l3.5 4.5L21 6l-4.5 3.5Z"/></svg>
);

const RemoveIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);


const EstudioVisualView: React.FC = () => {
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [prompt, setPrompt] = useState<string>('');
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setReferenceImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSuggestPrompt = async () => {
        setIsSuggesting(true);
        try {
            const suggestion = await suggestImagePrompt(aspectRatio, !!referenceImage);
            setPrompt(suggestion);
        } catch (error) {
            console.error(error);
            setPrompt("Ocorreu um erro ao buscar sugestão.");
        } finally {
            setIsSuggesting(false);
        }
    };
    
    const handleGenerateImage = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setGeneratedImage(null);
        setError(null);
        try {
            const base64Bytes = await generateImage(prompt, aspectRatio);
            const imageUrl = `data:image/png;base64,${base64Bytes}`;
            setGeneratedImage(imageUrl);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex h-full">
            <div className="w-1/3 border-r border-brand-lavender/50 p-6 flex flex-col gap-6 overflow-y-auto">
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl font-serif-display">Estúdio Visual</h1>
                    <button className="px-3 py-1.5 border border-brand-lavender/50 rounded-md text-sm font-medium hover:bg-brand-lavender/50 transition-colors duration-150 active:bg-brand-lavender/70">Créditos 10</button>
                </header>

                <div>
                    <label className="text-sm font-medium text-gray-700">Imagem de Referência</label>
                    <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    {referenceImage ? (
                        <div className="mt-1 relative group">
                            <img src={referenceImage} alt="Referência" className="w-full h-32 object-cover rounded-md" />
                            <button 
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <RemoveIcon />
                            </button>
                        </div>
                    ) : (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-1 flex justify-center items-center flex-col w-full h-32 px-6 pt-5 pb-6 border-2 border-brand-lavender/50 border-dashed rounded-md cursor-pointer hover:bg-brand-lavender/30 transition-colors duration-150"
                        >
                            <UploadIcon />
                            <span className="text-sm text-gray-500">Clique para fazer o upload da imagem</span>
                            <p className="text-xs text-gray-400 mt-1">Formatos: jpg, png, svg, e webp</p>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="prompt" className="text-sm font-medium text-gray-700">Comando Criativo</label>
                        <button 
                            onClick={handleSuggestPrompt}
                            disabled={isSuggesting}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-brand-dark-purple bg-brand-lavender/50 rounded-md hover:bg-brand-lavender/70 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isSuggesting ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-brand-dark-purple"></div>
                                    Sugerindo...
                                </>
                            ) : (
                                <>
                                    <SparkleIcon className="w-3 h-3" />
                                    Sugerir Comando
                                </>
                            )}
                        </button>
                    </div>
                    <textarea 
                        id="prompt" 
                        rows={5}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 w-full p-3 border border-brand-lavender/50 rounded-lg bg-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                        placeholder="Descreva aqui o que você deseja criar ou transformar..."
                    />
                </div>

                 <div>
                    <label className="text-sm font-medium text-gray-700">Mentora Visual</label>
                     <div className="mt-1 relative">
                        <select className="w-full p-3 border border-brand-lavender/50 rounded-lg bg-gray-100 text-gray-500 appearance-none cursor-not-allowed" disabled>
                            <option>Selecione uma mentora</option>
                        </select>
                         <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-0.5 rounded-full">Em breve</span>
                    </div>
                </div>

                <div>
                     <label className="text-sm font-medium text-gray-700 mb-2 block">Formato</label>
                     <div className="flex gap-2">
                        {(['1:1', '3:4', '4:3'] as AspectRatio[]).map(ar => (
                             <button 
                                key={ar}
                                onClick={() => setAspectRatio(ar)}
                                className={`flex flex-col items-center justify-center gap-1 w-16 h-16 border rounded-md transition-all duration-150 active:scale-95 ${aspectRatio === ar ? 'border-brand-gold bg-brand-gold/10' : 'border-brand-lavender/50 bg-white hover:border-brand-lilac'}`}
                            >
                                <div className={`bg-brand-lavender rounded-sm ${ar === '1:1' ? 'w-6 h-6' : ar === '3:4' ? 'w-5 h-6' : 'w-6 h-5'}`}></div>
                                <span className={`text-xs ${aspectRatio === ar ? 'text-brand-gold' : 'text-gray-500'}`}>{ar}</span>
                            </button>
                        ))}
                     </div>
                </div>
                
                <div className="mt-auto pt-6">
                    <button 
                        onClick={handleGenerateImage}
                        disabled={isGenerating || !prompt}
                        className="w-full px-6 py-3 bg-brand-dark-purple text-white rounded-md font-semibold hover:bg-brand-dark-purple/80 disabled:bg-gray-400 transition-all duration-150 active:scale-95 active:bg-brand-dark-purple/90 flex items-center justify-center"
                    >
                         {isGenerating ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Criando...
                            </div>
                        ) : 'Criar Imagem'}
                    </button>
                </div>

            </div>
            <div className="w-2/3 flex flex-col items-center justify-center text-center p-8 bg-brand-sand">
                {isGenerating ? (
                    <div className="w-full max-w-md flex flex-col items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-dark-purple mb-4"></div>
                        <h2 className="text-xl font-semibold">Criando sua imagem...</h2>
                        <p className="text-gray-500 max-w-xs">Aguarde um momento, a mágica está acontecendo.</p>
                    </div>
                ) : error ? (
                    <div className="w-full max-w-md flex flex-col items-center justify-center h-full text-red-600">
                        <h2 className="text-xl font-semibold mb-2">Erro na Geração</h2>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : generatedImage ? (
                    <div className="w-full max-w-md p-4">
                        <img 
                            src={generatedImage} 
                            alt={prompt}
                            className="w-full h-auto object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                ) : (
                    <>
                        <div className="w-full max-w-md p-4">
                            <img 
                                src="https://storage.googleapis.com/maker-me/uploads/2024/07/19/d6c8e3c1a7884d6568911002047d10f2.png" 
                                alt="Logomarca Elevare gerada por IA" 
                                className="w-full h-auto object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                        <h2 className="text-xl font-semibold mt-6 mb-2">Seu Estúdio Criativo</h2>
                        <p className="text-gray-500 max-w-xs">Use o painel à esquerda para gerar imagens como esta.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default EstudioVisualView;
