
import React from 'react';
import { ProjectTemplate } from '../types';

interface ProjectTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: ProjectTemplate[];
    onCreate: (template: ProjectTemplate) => void;
}

const ProjectTemplateModal: React.FC<ProjectTemplateModalProps> = ({ isOpen, onClose, templates, onCreate }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-brand-lavender/50 flex-shrink-0">
                    <h2 className="text-xl font-serif-display font-semibold">Usar um Modelo de Projeto</h2>
                    <p className="text-sm text-gray-500 mt-1">Comece com uma estratégia pronta e testada.</p>
                </header>
                <main className="p-6 flex-1 overflow-y-auto space-y-4">
                    {templates.map(template => (
                        <div key={template.id} className="border border-brand-lavender/50 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-brand-dark-purple">{template.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                     <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">{template.type}</span>
                                    {template.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-brand-lavender/40 text-brand-dark-purple rounded-full font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button 
                                onClick={() => onCreate(template)}
                                className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80 transition-all active:scale-95 flex-shrink-0"
                            >
                                Usar Modelo
                            </button>
                        </div>
                    ))}
                </main>
                <footer className="p-4 bg-gray-50 border-t border-brand-lavender/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                        Cancelar
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProjectTemplateModal;
