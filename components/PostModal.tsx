
import React, { useState, useEffect } from 'react';
import { ScheduledPost, PostStatus, RealtimeSuggestion } from '../types';
import { getRealtimeSuggestion } from '../services/lucresiaService';

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (post: ScheduledPost) => void;
    post: Partial<ScheduledPost>;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSave, post }) => {
    const [formData, setFormData] = useState<Partial<ScheduledPost>>({});
    const [suggestion, setSuggestion] = useState<RealtimeSuggestion | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);


    useEffect(() => {
        setFormData(post);
    }, [post]);

    useEffect(() => {
        if (!isOpen) {
            setSuggestion(null);
            setIsSuggesting(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const content = formData.content || '';
        // Debounce logic
        const handler = setTimeout(() => {
            if (content && content.trim().split(' ').length > 10) {
                setIsSuggesting(true);
                setSuggestion(null); // Clear old suggestion
                getRealtimeSuggestion(content).then(res => {
                    setSuggestion(res);
                    setIsSuggesting(false);
                }).catch(() => setIsSuggesting(false));
            } else {
                setSuggestion(null);
            }
        }, 1500);

        return () => {
            clearTimeout(handler);
            setIsSuggesting(false);
        };
    }, [formData.content]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const finalPost: ScheduledPost = {
            id: formData.id || `post_${Date.now()}`,
            title: formData.title || 'Novo Post',
            date: formData.date!,
            status: formData.status || 'Ideia',
            content: formData.content || '',
        };
        onSave(finalPost);
    };

    const statusOptions: PostStatus[] = ['Ideia', 'Rascunho', 'Agendado', 'Publicado'];

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
                    <h2 className="text-xl font-serif-display font-semibold">{formData.id ? 'Editar Post' : 'Novo Post'}</h2>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="text-sm font-medium text-gray-700">Conteúdo / Nota</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content || ''}
                            onChange={handleChange}
                            rows={6}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-brand-dark-purple"
                        />
                        {isSuggesting && <p className="text-xs text-gray-500 mt-2 flex items-center gap-2"><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>LucresIA está pensando...</p>}
                        {suggestion && (
                            <div className="mt-2 p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-lg text-sm transition-all duration-300">
                                <p className="font-semibold text-brand-dark-purple">Sugestão Rápida 🧠</p>
                                <p className="text-gray-700 mt-1">{suggestion.suggestion}</p>
                                <p className="text-xs text-gray-500 mt-2"><em>Motivo: {suggestion.reason}</em></p>
                                <button 
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, content: suggestion.suggestion }));
                                        setSuggestion(null);
                                    }}
                                    className="mt-2 px-3 py-1 bg-brand-gold text-white text-xs font-semibold rounded-md hover:bg-brand-gold/80"
                                >
                                    Aplicar Sugestão
                                </button>
                            </div>
                        )}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="text-sm font-medium text-gray-700">Data</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date || ''}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                         <div>
                            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status || 'Ideia'}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            >
                                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                </main>
                <footer className="p-4 bg-gray-50 border-t border-brand-lavender/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-100">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-brand-dark-purple text-white rounded-md text-sm font-medium hover:bg-brand-dark-purple/80">
                        Salvar Post
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PostModal;
