
import React from 'react';
import { ActiveView } from '../types';

interface LaboratorioViewProps {
    onNavigate: (view: ActiveView) => void;
}

const ToolIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.5 3h15"/>
        <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/>
        <path d="M6 14h12"/>
    </svg>
);

const labTools = {
    '🎠 Criação de Carrosséis': [
        { name: 'Simplified', description: 'IA que transforma textos em carrosséis prontos e agendáveis. Ideal para posts educativos e visuais elegantes.', url: 'https://simplified.com' },
        { name: 'Gamma App', description: 'Transforme textos em apresentações e carrosséis com storytelling automático e visual premium.', url: 'https://gamma.app' },
        { name: 'Tome', description: 'IA de design narrativo — basta descrever seu tema e o Tome cria o carrossel com texto e imagem harmonizados.', url: 'https://tome.app' }
    ],
    '📱 Criação de Postagens': [
        { name: 'Notion + IA', description: 'Organize ideias, gere legendas e roteiros automáticos com IA integrada — ideal para estruturar seu feed profissional.', url: 'https://www.notion.so' },
        { name: 'Deepsite AI', description: 'Crie posts prontos com texto, imagem e CTA. Gera variações automáticas e integra com WhatsApp e Google Sheets.', url: 'https://deepsite.ai' },
        { name: 'Genspark', description: 'Gere ideias, títulos, scripts e posts completos com IA multimodal. Interface intuitiva e visual profissional.', url: 'https://genspark.ai' }
    ],
    '🎬 Criação de Vídeos': [
        { name: 'Pika Labs', description: 'Gere vídeos curtos a partir de texto ou imagem. Crie Reels e animações automáticas com estilo cinematográfico.', url: 'https://pika.art' },
        { name: 'Runway ML', description: 'Edição e geração automática de vídeos com IA profissional. Remove fundo, gera voz e corta silêncios em segundos.', url: 'https://runwayml.com' },
        { name: 'InVideo AI', description: 'Crie vídeos com narração e trilha em minutos. Basta digitar o tema — perfeito para Reels e campanhas promocionais.', url: 'https://invideo.io' }
    ]
};

const LaboratorioView: React.FC<LaboratorioViewProps> = ({ onNavigate }) => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-brand-sand">
            <header className="text-center mb-10 md:mb-12">
                 <div className="inline-block bg-brand-lavender/50 p-4 rounded-full mb-4">
                     <ToolIcon className="text-brand-dark-purple" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif-display text-brand-dark-purple">Laboratório Elevare</h1>
                <p className="text-brand-graphite/80 mt-2 text-base md:text-lg max-w-2xl mx-auto">
                    Bem-vinda ao seu espaço criativo! Aqui você encontra as melhores ferramentas gratuitas para criar conteúdos visuais incríveis — curadoria oficial da <strong>LucresIA</strong>.
                </p>
            </header>
            
            <main className="max-w-6xl mx-auto">
                {Object.entries(labTools).map(([category, tools]) => (
                    <section key={category} className="mb-12">
                        <h2 className="text-2xl font-serif-display text-brand-soft-black mb-6">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tools.map((tool, toolIndex) => (
                                <div key={toolIndex} className="bg-white border border-brand-lavender/50 rounded-xl p-6 flex flex-col gap-3 shadow-subtle hover:shadow-lg hover:border-brand-lilac transition-all duration-200 hover:-translate-y-1">
                                    <h3 className="font-bold text-brand-soft-black text-lg flex items-center gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-brand-lavender/50 text-brand-dark-purple rounded-lg flex items-center justify-center font-bold">{toolIndex + 1}</span>
                                        {tool.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 flex-1">{tool.description}</p>
                                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="mt-3 block w-full text-center px-4 py-2 bg-brand-dark-purple text-white rounded-lg text-sm font-semibold hover:bg-brand-dark-purple/90 transition-all duration-150 active:scale-95 shadow-md shadow-brand-dark-purple/20">
                                        Abrir {tool.name}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
                
                <div className="mt-16 text-center p-8 bg-gradient-to-br from-brand-lavender/40 via-white to-brand-nude/30 border border-brand-lavender/50 rounded-2xl">
                    <h2 className="text-xl md:text-2xl font-serif-display font-semibold text-brand-dark-purple mb-3">Toda vez que criar algo fora, traga pra cá.</h2>
                    <p className="text-brand-graphite mb-6 max-w-lg mx-auto">A LucresIA analisa e aprimora seu conteúdo, garantindo que ele esteja alinhado com a sua Essência e com os princípios que convertem.</p>
                    <button 
                        onClick={() => onNavigate('Avaliador de Conteúdo')}
                        className="px-6 py-3 bg-brand-gold text-white rounded-lg font-semibold hover:bg-brand-gold/90 transition-all duration-150 active:scale-95 shadow-md shadow-brand-gold/30">
                        Aprimorar meu conteúdo
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LaboratorioView;
