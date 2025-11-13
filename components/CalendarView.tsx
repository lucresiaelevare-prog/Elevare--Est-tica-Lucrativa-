
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ScheduledPost, PostStatus, ContentSuggestion, Essencia } from '../types';
import { FeedbackIcon } from '../constants';
import { generateMonthlySuggestions } from '../services/geminiService';

interface CalendarViewProps {
    posts: ScheduledPost[];
    essencias: Essencia[];
    onAddPost: (date: string) => void;
    onEditPost: (post: ScheduledPost) => void;
    onOpenFeedbackModal: (post: ScheduledPost) => void;
    onLaunchPiloto: (theme: string) => void;
}

const statusColors: Record<PostStatus, { bg: string; text: string; }> = {
    'Ideia': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Rascunho': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'Agendado': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'Publicado': { bg: 'bg-green-100', text: 'text-green-800' },
};

const suggestionCategoryColors: Record<ContentSuggestion['category'], { bg: string, text: string, border: string }> = {
    'Autoridade': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Vendas': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Prova Social': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Lifestyle': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

const InfoIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);


const CalendarView: React.FC<CalendarViewProps> = ({ posts, essencias, onAddPost, onEditPost, onOpenFeedbackModal, onLaunchPiloto }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allSuggestions, setAllSuggestions] = useState<{ [key: string]: { [day: number]: ContentSuggestion } }>({});
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const monthlySuggestions = allSuggestions[monthKey] || {};

    const fetchSuggestionsForMonth = useCallback(async (year: number, month: number) => {
        const key = `${year}-${month}`;
        if (allSuggestions[key]) return;

        setIsLoadingSuggestions(true);
        try {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const postsInMonth = posts.filter(p => {
                const [postYear, postMonth] = p.date.split('-').map(Number);
                return postYear === year && postMonth === month + 1;
            });

            const emptyDays: number[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasPost = postsInMonth.some(p => p.date === dateStr);
                const isPast = date < today;
                if (!hasPost && !isPast) {
                    emptyDays.push(day);
                }
            }

            if (emptyDays.length > 0) {
                const newSuggestions = await generateMonthlySuggestions(essencias, emptyDays);
                setAllSuggestions(prev => ({ ...prev, [key]: newSuggestions }));
            }
        } catch (error) {
            console.error("Failed to fetch calendar suggestions", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, [allSuggestions, essencias, posts]);


    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        fetchSuggestionsForMonth(year, month);
    }, [currentDate.getFullYear(), currentDate.getMonth(), fetchSuggestionsForMonth]);


    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    };

    const renderHeader = () => {
        const monthFormat = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
        return (
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-serif-display capitalize">{monthFormat.format(currentDate)}</h1>
                    <div className="relative group">
                        <InfoIcon className="w-5 h-5 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-brand-soft-black text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            As sugestões de conteúdo são geradas seguindo um planejamento de postagens otimizado, estratégico e equilibrado.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-brand-soft-black"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-brand-lavender/50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-brand-lavender/50 transition-colors">
                        Hoje
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-brand-lavender/50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        return (
            <div className="grid grid-cols-7">
                {daysOfWeek.map((day, i) => (
                    <div key={`${day}-${i}`} className="text-center text-xs md:text-sm font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`empty-${i}`} className="bg-gray-50/50 border-r border-b border-gray-200"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const postsForDay = posts.filter(p => p.date === dateStr);
            const isToday = today.getTime() === date.getTime();
            const isPast = date < today;
            const suggestion = monthlySuggestions[day];

            cells.push(
                <div key={day} className="relative bg-white p-1 md:p-2 min-h-[100px] md:min-h-[140px] flex flex-col group border-r border-b border-gray-200">
                    <div className="flex justify-between items-center">
                       <span className={`text-xs md:text-sm font-medium ${isToday ? 'bg-brand-dark-purple text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'}`}>
                           {day}
                       </span>
                        <button onClick={() => onAddPost(dateStr)} className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-brand-lavender/50 rounded-full text-brand-dark-purple hover:bg-brand-lavender">
                            +
                        </button>
                    </div>
                    <div className="flex-1 mt-1 space-y-1 overflow-y-auto">
                        {postsForDay.map(post => {
                             const { bg, text } = statusColors[post.status];
                             const canShowFeedback = post.status === 'Publicado' && isPast && !post.performance;
                             return (
                                <div 
                                    key={post.id} 
                                    onClick={() => onEditPost(post)}
                                    className={`p-1.5 rounded-md text-xs cursor-pointer ${bg} ${text} hover:opacity-80 flex justify-between items-center`}
                                >
                                    <p className="font-semibold truncate pr-1">{post.title}</p>
                                    {canShowFeedback && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onOpenFeedbackModal(post); }}
                                            className="flex-shrink-0 p-0.5 rounded-full bg-white/50 hover:bg-white"
                                            title="Analisar Performance"
                                        >
                                            <FeedbackIcon className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                             )
                        })}
                        {postsForDay.length === 0 && !isPast && (
                            isLoadingSuggestions && !suggestion ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                </div>
                            ) : suggestion ? (
                                <div className={`relative p-2 rounded-md text-xs border-l-4 flex flex-col justify-between h-full ${suggestionCategoryColors[suggestion.category].bg} ${suggestionCategoryColors[suggestion.category].border}`}>
                                    <div>
                                        <span className={`font-bold ${suggestionCategoryColors[suggestion.category].text}`}>{suggestion.category}</span>
                                        <p className={`mt-0.5 ${suggestionCategoryColors[suggestion.category].text.replace('700','600')}`}>{suggestion.title}</p>
                                    </div>
                                    <div className="mt-2 flex flex-col sm:flex-row gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => onLaunchPiloto(suggestion.prompt)}
                                            className="px-2 py-1 text-[10px] font-semibold bg-white border border-gray-300 rounded hover:bg-gray-100 flex-1 text-center"
                                        >
                                            Usar Ideia
                                        </button>
                                    </div>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            );
        }

        return <div className="grid grid-cols-7 grid-rows-5 auto-rows-fr gap-px border-l border-t border-gray-200">{cells}</div>;
    };


    return (
        <div className="p-4 md:p-8 h-full flex flex-col bg-gray-50/50">
            {renderHeader()}
            <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg">
                {renderDays()}
                {renderCells()}
            </div>
        </div>
    );
};

export default CalendarView;
