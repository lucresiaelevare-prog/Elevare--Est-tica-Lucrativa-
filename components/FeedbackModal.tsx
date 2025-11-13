
import React from 'react';
import { ScheduledPost, PostPerformance } from '../types';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (postId: string, performance: PostPerformance) => void;
    post: ScheduledPost;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSave, post }) => {

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-brand-soft-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-brand-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-serif-display font-semibold mb-2">Analisar Performance</h2>
                <p className="text-gray-500 mb-6">Como foi o desempenho do post <strong className="text-brand-dark-purple">"{post.title}"</strong>?</p>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => onSave(post.id, { rating: 'incrivel' })}
                        className="w-full text-left flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                        <span className="text-2xl">🔥</span>
                        <div>
                            <p className="font-semibold">Incrível</p>
                            <p className="text-sm text-gray-500">Superou as expectativas.</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => onSave(post.id, { rating: 'normal' })}
                        className="w-full text-left flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                        <span className="text-2xl">👍</span>
                        <div>
                            <p className="font-semibold">Normal</p>
                            <p className="text-sm text-gray-500">Dentro do esperado.</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => onSave(post.id, { rating: 'fraco' })}
                        className="w-full text-left flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                    >
                        <span className="text-2xl">👎</span>
                        <div>
                            <p className="font-semibold">Fraco</p>
                            <p className="text-sm text-gray-500">Abaixo do esperado.</p>
                        </div>
                    </button>
                </div>
                
                <button onClick={onClose} className="mt-6 text-sm text-gray-500 hover:text-gray-800">
                    Analisar depois
                </button>
            </div>
        </div>
    );
};

export default FeedbackModal;