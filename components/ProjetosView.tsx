

import React from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjetosViewProps {
    projects: Project[];
    onAddProject: () => void;
    onViewProjectDetails: (id: string) => void;
    onOpenTemplateModal: () => void;
}

const statusStyles: Record<ProjectStatus, { bg: string; text: string; icon: React.FC<{ className?: string }> }> = {
    Planejamento: { bg: 'bg-blue-100', text: 'text-blue-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg> },
    Ativo: { bg: 'bg-green-100', text: 'text-green-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> },
    Concluído: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg> },
    Pausado: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg> },
};

const ProjectCard: React.FC<{ project: Project; onSelect: (id: string) => void }> = ({ project, onSelect }) => {
    const { bg, text, icon: StatusIcon } = statusStyles[project.status];
    
    return (
        <button 
            onClick={() => onSelect(project.id)}
            className="bg-white border border-brand-lavender/50 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-lg hover:border-brand-lilac transition-all duration-200 cursor-pointer hover:-translate-y-1 active:scale-[0.98] text-left"
        >
            <div className="flex justify-between items-start">
                 <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bg} ${text} flex items-center gap-1.5`}>
                    <StatusIcon className="w-4 h-4" /> {project.status}
                </span>
            </div>
            <div>
                <h3 className="font-bold text-brand-soft-black text-lg">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">{project.description}</p>
            </div>
            <div className="mt-auto pt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1.5 bg-purple-100 text-purple-800 rounded-full font-medium">{project.type}</span>
                {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1.5 bg-brand-lavender/40 text-brand-dark-purple rounded-full font-medium">
                        {tag}
                    </span>
                ))}
            </div>
        </button>
    );
};

const ProjetosView: React.FC<ProjetosViewProps> = ({ projects, onAddProject, onViewProjectDetails, onOpenTemplateModal }) => {
    const isEmpty = projects.length === 0;

    return (
        <div className="h-full flex flex-col">
            <header className="p-4 md:p-6 border-b border-brand-lavender/50 flex flex-col md:flex-row justify-between md:items-center gap-4 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl md:text-2xl font-serif-display">Projetos</h1>
                    <p className="text-gray-500 text-sm">Organize suas campanhas, funis e planejamentos.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={onOpenTemplateModal}
                        className="flex-1 md:flex-none px-4 py-2 bg-white border border-brand-lavender/80 text-brand-dark-purple rounded-md text-sm font-semibold hover:bg-brand-lavender/50 flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
                    >
                       ✨ <span className="hidden sm:inline">Usar</span> Modelo
                    </button>
                    <button
                        onClick={onAddProject}
                        aria-label="Criar novo projeto"
                        className="flex-1 md:flex-none px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 active:bg-brand-dark-purple/90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>
                        <span className="hidden sm:inline">Novo</span> Projeto
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-brand-lavender/10">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className="w-20 h-20 bg-brand-lavender/50 rounded-full flex items-center justify-center mb-6">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-brand-lilac"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Seu império começa aqui</h2>
                        <p className="text-gray-500 max-w-sm">Crie seu primeiro projeto do zero ou use um modelo para começar com uma estratégia pronta.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} onSelect={onViewProjectDetails} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProjetosView;
