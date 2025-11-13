

import React, { useState, useEffect } from 'react';
import { Project, ProjectType, ProjectStatus } from '../types';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Project) => void;
    project: Partial<Project>;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
    const [formData, setFormData] = useState<Partial<Project>>({});
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => {
        setFormData(project);
        setTagsInput(project.tags?.join(', ') || '');
    }, [project]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const finalProject: Project = {
            id: formData.id || `proj_${Date.now()}`,
            name: formData.name || 'Novo Projeto',
            description: formData.description || '',
            goal: formData.goal || '',
            type: formData.type || 'Planejamento de Conteúdo',
            tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
            status: formData.status || 'Planejamento',
            modified: new Date().toLocaleDateString('pt-BR'),
        };
        onSave(finalProject);
    };

    const projectTypes: ProjectType[] = ['Campanha de Lançamento', 'Funil de Vendas', 'Planejamento de Conteúdo', 'Linha Editorial', 'Anúncios', 'E-mail Marketing', 'Branding & Posicionamento'];
    const projectStatuses: ProjectStatus[] = ['Planejamento', 'Ativo', 'Concluído', 'Pausado'];

    return (
        <div 
            className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-brand-lavender/50">
                    <h2 className="text-xl font-serif-display font-semibold">{formData.id ? 'Editar Projeto' : 'Novo Projeto'}</h2>
                    <p className="text-sm text-gray-500 mt-1">Organize suas campanhas, funis e linhas editoriais.</p>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Nome*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple"
                            placeholder="Ex: Lançamento 'Pele de Seda'"
                        />
                    </div>
                     <div>
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple"
                             placeholder="Ex: Campanha trimestral para promover o novo protocolo..."
                        />
                    </div>
                     <div>
                        <label htmlFor="goal" className="text-sm font-medium text-gray-700">Meta</label>
                        <textarea
                            id="goal"
                            name="goal"
                            value={formData.goal || ''}
                            onChange={handleChange}
                            rows={2}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple"
                            placeholder="Ex: Gerar 20 agendamentos de avaliação na primeira semana."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="text-sm font-medium text-gray-700">Tipo*</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type || ''}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="" disabled>Selecione</option>
                                {projectTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status || 'Planejamento'}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            >
                                {projectStatuses.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="tags" className="text-sm font-medium text-gray-700">Categorias</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple"
                            placeholder="Ex: Lançamentos, Vendas, Instagram"
                        />
                         <p className="text-xs text-gray-400 mt-1">Separe as categorias por vírgula.</p>
                    </div>
                </main>
                <footer className="p-4 bg-gray-50 border-t border-brand-lavender/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80">
                        {formData.id ? 'Salvar Projeto' : 'Criar Projeto'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProjectModal;