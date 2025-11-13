
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, Essencia, ActiveView } from '../types';
import { startLucresiaChat, sendLucresiaMessage } from '../services/lucresiaService';

// ICONS
const SendIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const LucresiaAvatar = () => (
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-lavender via-brand-nude to-brand-lilac/80 flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-lavender/50">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18h18v2H3v-2zM5.6 8.1l3.6 3.1 2.8-4.2 2.8 4.2 3.6-3.1 1.6 7.9H4l1.6-7.9z"/>
        </svg>
    </div>
);
const UserAvatar = () => (
    <div className="w-8 h-8 bg-brand-lavender/50 rounded-full text-brand-dark-purple flex items-center justify-center font-semibold flex-shrink-0">
        EM
    </div>
);
const HistoryIcon = ({ className = 'w-3 h-3' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;
const PlusIcon = ({ className = 'w-3 h-3' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const ArrowRightIcon = ({ className = 'w-3 h-3' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const MicIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;


interface ConversaLucresiaViewProps {
  initialContext: string | null;
  initialUserMessage: string | null;
  onClearContext: () => void;
  onClearInitialMessage: () => void;
  essencias: Essencia[];
  defaultEssenciaId?: string;
  onNavigate: (view: ActiveView) => void;
  onAddProject: () => void;
}

const ConversaLucresiaView: React.FC<ConversaLucresiaViewProps> = ({ 
    initialContext, 
    initialUserMessage, 
    onClearContext, 
    onClearInitialMessage,
    essencias,
    defaultEssenciaId,
    onNavigate,
    onAddProject,
}) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEssenciaId, setSelectedEssenciaId] = useState<string>(defaultEssenciaId || 'none');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedEssenciaId(defaultEssenciaId || 'none');
  }, [defaultEssenciaId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async (messageOverride?: string) => {
    const messageContent = messageOverride || userInput;
    if (!messageContent.trim() || isLoading || !chat) return;

    const newUserMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: messageContent,
    };
    
    // Don't add the message to state if it's an override, as it will be added by the useEffect
    if (!messageOverride) {
      setMessages(prev => [...prev, newUserMessage]);
    }
    
    setUserInput('');
    setIsLoading(true);

    try {
      let finalMessage = messageContent;
      if (selectedEssenciaId !== 'none') {
          const selected = essencias.find(e => e.id === selectedEssenciaId);
          if (selected) {
              const context = `Contexto da Essência da Marca (${selected.title}):\n${JSON.stringify(selected.fields.map(f => ({[f.title]: f.content})))} \n\n---\n\n`;
              finalMessage = context + messageContent;
          }
      }

      const responseText = await sendLucresiaMessage(finalMessage, chat);
      const lucresiaMessage: ChatMessage = {
        id: `lucresia_${Date.now()}`,
        sender: 'lucresia',
        content: responseText,
      };
      setMessages(prev => [...prev, lucresiaMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        sender: 'lucresia',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
   // Effect to initialize chat
    useEffect(() => {
        handleNewChat();
    }, []);

    const handleNewChat = () => {
        const chatSession = startLucresiaChat();
        setChat(chatSession);
        setMessages([{
            id: `lucresia_${Date.now()}`,
            sender: 'lucresia',
            content: 'Olá! Sou LucresIA, sua mentora digital. Como posso te ajudar a elevar seu negócio hoje?'
        }]);
    }

    // Effect to handle initial context/prompt when chat is ready
    useEffect(() => {
        if (chat && initialContext) {
            const fullMessageForAPI = `${initialUserMessage || 'Refine o seguinte texto:'}\n\n**Texto original:**\n\n---\n${initialContext}\n---`;

            if(initialUserMessage) {
                const userDisplayMessage: ChatMessage = { id: `user_${Date.now()}`, sender: 'user', content: initialUserMessage };
                const lucresiaContextMessage: ChatMessage = { id: `context_${Date.now()}`, sender: 'lucresia', content: `Ok, vamos refinar! Contexto carregado.` };
                setMessages(prev => [...prev, lucresiaContextMessage, userDisplayMessage]);
                handleSendMessage(fullMessageForAPI);
            } else {
                 const lucresiaContextMessage: ChatMessage = { id: `context_${Date.now()}`, sender: 'lucresia', content: `Contexto carregado. O que você gostaria de fazer com este texto?` };
                 setMessages(prev => [...prev, lucresiaContextMessage]);
            }
            onClearContext();
            onClearInitialMessage();
        }
    }, [chat, initialContext, initialUserMessage]);

    // Effect to handle an initial user message without context
    useEffect(() => {
        if (chat && initialUserMessage && !initialContext) {
            const userMessage: ChatMessage = {
                id: `user_initial_${Date.now()}`,
                sender: 'user',
                content: initialUserMessage,
            };
            setMessages(prev => [...prev, userMessage]);
            handleSendMessage(initialUserMessage);
            onClearInitialMessage();
        }
    }, [chat, initialUserMessage, initialContext]);


  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-white">
      <header className="flex-shrink-0 mb-6">
        <h1 className="text-xl md:text-2xl font-serif-display">Conversar com LucresIA</h1>
        <p className="text-gray-500 text-sm md:text-base">Sua mentora de marketing para estética.</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 md:gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            {message.sender === 'lucresia' && <LucresiaAvatar />}
            <div className={`max-w-lg md:max-w-xl p-3 md:p-4 rounded-xl ${message.sender === 'lucresia' ? 'bg-brand-lavender/30' : 'bg-brand-dark-purple text-white'}`}>
                <div className="prose prose-sm max-w-none prose-p:my-0 text-inherit" dangerouslySetInnerHTML={{__html: typeof message.content === 'string' ? message.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : ''}}></div>
                {typeof message.content !== 'string' && message.content}
            </div>
            {message.sender === 'user' && <UserAvatar />}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-4">
                <LucresiaAvatar />
                <div className="max-w-xl p-4 rounded-xl bg-brand-lavender/30 flex items-center">
                    <div className="w-2 h-2 bg-brand-dark-purple rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-brand-dark-purple rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                    <div className="w-2 h-2 bg-brand-dark-purple rounded-full animate-bounce"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
       <div className="flex-shrink-0 pt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <HistoryIcon className="w-3.5 h-3.5"/> Histórico
            </button>
            <button 
                onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <PlusIcon className="w-3.5 h-3.5"/> Novo Chat
            </button>
            <div className="hidden sm:flex flex-1" />
             <button 
                onClick={onAddProject}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Novo Projeto <ArrowRightIcon className="w-3.5 h-3.5"/>
            </button>
             <button 
                onClick={() => onNavigate('Trilhas')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                Explorar Trilhas <ArrowRightIcon className="w-3.5 h-3.5"/>
            </button>
        </div>
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Continue a sua conversa..."
            rows={2}
            className="w-full p-4 pr-28 md:pr-48 border border-brand-lavender/50 rounded-xl resize-none focus:ring-1 focus:ring-brand-dark-purple focus:border-brand-dark-purple"
          />
          <div className="absolute bottom-3 right-3 flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <select
                value={selectedEssenciaId}
                onChange={(e) => setSelectedEssenciaId(e.target.value)}
                className="text-xs bg-transparent border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-brand-dark-purple h-10"
            >
                <option value="none">DNA</option>
                {essencias.map(essencia => (
                    <option key={essencia.id} value={essencia.id}>{essencia.title}</option>
                ))}
            </select>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <MicIcon />
              </button>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !userInput.trim()}
                className="w-10 h-10 bg-brand-dark-purple text-white rounded-lg flex items-center justify-center disabled:bg-gray-400 transition-all active:scale-90"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">LucresIA pode cometer erros. Verifique as informações importantes.</p>
      </div>
    </div>
  );
};

export default ConversaLucresiaView;
