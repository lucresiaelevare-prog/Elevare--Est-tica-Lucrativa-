
import React from 'react';
import { journeyStages } from '../constants';
import { JourneyStage } from '../types';

interface JornadaViewProps {
    onSelectStage: (stage: JourneyStage) => void;
}

const JornadaView: React.FC<JornadaViewProps> = ({ onSelectStage }) => {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-brand-sand">
            <header className="text-center mb-10 md:mb-16">
                 <div className="inline-block bg-brand-lavender/50 p-4 rounded-full mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-brand-dark-purple"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif-display text-brand-soft-black">Jornada da Cliente de Alto Valor</h1>
                <p className="text-brand-graphite/80 mt-2 text-base md:text-lg max-w-3xl mx-auto">Mapeie e crie conteúdo para cada ponto de contato. Transforme seguidoras em fãs e clientes em embaixadoras da sua marca.</p>
            </header>
            
            <main className="relative">
                <div className="flex flex-col md:flex-row items-center justify-center gap-x-0 gap-y-12 md:gap-x-4">
                    {journeyStages.map((stage, index) => (
                        <React.Fragment key={stage.id}>
                            <div 
                                onClick={() => onSelectStage(stage)}
                                className="w-full md:w-48 text-center flex flex-col items-center cursor-pointer group"
                            >
                                <div className="w-20 h-20 rounded-full border-2 border-brand-lavender/70 bg-white flex items-center justify-center transition-all duration-300 group-hover:border-brand-gold group-hover:scale-110 group-hover:shadow-lg">
                                    <stage.icon className="w-9 h-9 text-brand-dark-purple transition-colors duration-300 group-hover:text-brand-gold" />
                                </div>
                                <h3 className="font-bold text-brand-soft-black mt-4 text-lg">{stage.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 px-2">{stage.description}</p>
                            </div>

                            {index < journeyStages.length - 1 && (
                                <div className="w-16 h-px md:h-auto md:w-auto flex-1 bg-transparent border-t-2 md:border-l-2 border-brand-lavender/70 border-dashed"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default JornadaView;
