

import React from 'react';
import { Project, ScheduledPost, ProjectStatus } from '../types';

interface ProjectDetailViewProps {
    project: Project;
    posts: ScheduledPost[];
    onBack: () => void;
    onEditProject: (project: Project) => void;
    onAddPost: () => void;
}

const statusStyles: Record<ProjectStatus, { bg: string; text: string; icon: React.FC<{ className?: string }> }> = {
    Planejamento: { bg: 'bg-blue-100', text: 'text-blue-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg> },
    Ativo: { bg: 'bg-green-100', text: 'text-green-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> },
    Concluído: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg> },
    Pausado: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg> },
};


const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, posts, onBack, onEditProject, onAddPost }) => {
    const { bg, text, icon: StatusIcon } = statusStyles[project.status];

    const performanceSummary = posts.reduce((acc, post) => {
        if (post.performance) {
            acc.totalPosts++;
            if (post.performance.rating === 'incrivel') acc.incrivel++;
            if (post.performance.rating === 'normal') acc.normal++;
            if (post.performance.rating === 'fraco') acc.fraco++;
        }
        return acc;
    }, { totalPosts: 0, incrivel: 0, normal: 0, fraco: 0 });

    return (
        <div className="h-full flex flex-col p-8">
            <header className="mb-6">
                <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-brand-dark-purple flex items-center gap-2 mb-4 transition-transform active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
                    Voltar para Projetos
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h1 className="text-2xl font-serif-display">{project.name}</h1>
                           <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bg} ${text} flex items-center gap-1.5`}>
                                <StatusIcon className="w-4 h-4" /> {project.status}
                            </span>
                        </div>
                        <p className="text-gray-500 max-w-2xl">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={() => onEditProject(project)}
                            className="px-4 py-2 bg-white border border-brand-lavender/80 text-brand-dark-purple rounded-md text-sm font-semibold hover:bg-brand-lavender/50 flex items-center gap-2 transition-all duration-150 active:scale-95"
                        >
                           Editar Projeto
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Left Column: Posts */}
                <div className="lg:col-span-2 bg-white border border-brand-lavender/50 rounded-lg flex flex-col">
                    <div className="p-4 border-b border-brand-lavender/50 flex justify-between items-center">
                        <h2 className="font-semibold">Conteúdos da Campanha ({posts.length})</h2>
                        <button onClick={onAddPost} className="px-3 py-1.5 bg-brand-dark-purple text-white rounded-md text-xs font-medium hover:bg-brand-dark-purple/80 transition-all">
                            + Adicionar Post
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {posts.length > 0 ? (
                            posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(post => (
                                <div key={post.id} className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-sm">{post.title}</p>
                                        <p className="text-xs text-gray-500">Data: {new Date(post.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ {Ideia: 'bg-blue-100 text-blue-800', Rascunho: 'bg-yellow-100 text-yellow-800', Agendado: 'bg-purple-100 text-purple-800', Publicado: 'bg-green-100 text-green-800'}[post.status] }`}>{post.status}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-12">
                                <p>Nenhum post vinculado a este projeto ainda.</p>
                                <p className="text-xs">Use o botão acima para adicionar.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details & Performance */}
                <div className="bg-white border border-brand-lavender/50 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Detalhes</h3>
                        <div className="text-sm space-y-1">
                            <p><strong>Tipo:</strong> {project.type}</p>
                            <p><strong>Meta:</strong> {project.goal || 'Não definida'}</p>
                            <p><strong>Última Modificação:</strong> {project.modified}</p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-0.5 bg-brand-lavender/40 text-brand-dark-purple rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="border-t border-brand-lavender/50 pt-4">
                        <h3 className="font-semibold text-sm mb-2">Performance da Campanha</h3>
                        {performanceSummary.totalPosts > 0 ? (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center"><span className="text-sm">🔥 Incrível</span><span className="font-bold">{performanceSummary.incrivel}</span></div>
                                <div className="flex justify-between items-center"><span className="text-sm">👍 Normal</span><span className="font-bold">{performanceSummary.normal}</span></div>
                                <div className="flex justify-between items-center"><span className="text-sm">👎 Fraco</span><span className="font-bold">{performanceSummary.fraco}</span></div>
                                <div className="border-t border-dashed mt-2 pt-2 flex justify-between items-center"><span className="text-sm font-semibold">Total Analisado</span><span className="font-bold">{performanceSummary.totalPosts}</span></div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Nenhum post analisado ainda.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailView;