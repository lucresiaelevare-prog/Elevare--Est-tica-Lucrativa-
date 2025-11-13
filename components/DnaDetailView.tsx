
import React, { useState, useEffect } from 'react';
import { Essencia, TourStep, Workspace } from '../types';
import TourModal from './TourModal';
import { analyzeUserStyle } from '../services/lucresiaService';

interface EssenciaDetailViewProps {
    essencia: Essencia;
    onBack: () => void;
    onUpdateField: (essenciaId: string, fieldId: string, newContent: string) => void;
    isDefault: boolean;
    onSetDefault: () => void;
    workspace: Workspace;
}

// Add icons to the component
const SpinnerIcon = () => <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 6 9 17l-5-5"/></svg>;

const tourSteps: TourStep[] = [
    {
        title: "Revise os campos",
        content: <>Note que alguns campos estão com ícone dourado — isso significa que foram campos criados <strong>automaticamente</strong>.<br/><br/>Nesse caso recomendamos que analise cada um deles e, caso ache necessário, <strong>preencha ou edite qualquer informação</strong>.<br/><br/>Assim, suas <strong>Mentoras</strong> garantem criações cada vez melhores e mais precisas para você :)</>
    },
    {
        title: "Opções de preenchimento",
        content: <>Você pode utilizar nossa ajuda sempre que precisar para <strong>criar ou melhorar os campos</strong> da sua Essência da Marca de forma automática.<br/><br/>E claro, pode também preencher os campos com sua voz (nesse ícone do microfone).<br/><br/>Ah, <strong>não se esqueça de revisar, ok?</strong></>
    },
    {
        title: "Configure sua Essência da Marca",
        content: <>Outra bem legal ↓<br/><br/>Você pode definir qualquer Essência da Marca como padrão, assim ela aparece pré-carregada em toda mentora que selecionar.<br/><br/><strong>Adianta a vida 🙏</strong></>
    },
    {
        title: "Agora é com você!",
        content: <>Analise e preencha os demais campos. Caso tenha dúvidas, <strong>estamos sempre à disposição</strong> através dos nossos canais de suporte.<br/><br/><strong>Bora escalar. 🚀</strong></>
    }
];

const EssenciaDetailView: React.FC<EssenciaDetailViewProps> = ({ essencia, onBack, onUpdateField, isDefault, onSetDefault, workspace }) => {
    const [activeField, setActiveField] = useState(essencia.fields[0]?.id || null);
    const [isTourActive, setTourActive] = useState(true);
    const [tourStep, setTourStep] = useState(0);
    
    const currentField = essencia.fields.find(f => f.id === activeField);
    const [editedContent, setEditedContent] = useState(currentField?.content || '');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const isDirty = currentField && editedContent !== currentField.content;

    useEffect(() => {
        const field = essencia.fields.find(f => f.id === activeField);
        if (field) {
            setEditedContent(field.content);
            setSaveStatus('idle');
        }
    }, [activeField, essencia]);

    const handleSave = () => {
        if (!isDirty || !currentField) return;

        setSaveStatus('saving');
        setTimeout(() => {
            onUpdateField(essencia.id, currentField.id, editedContent);
            setSaveStatus('saved');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        }, 1000);
    };

    const handleAnalyzeStyle = async () => {
        if (!currentField) return;
        setIsAnalyzing(true);
        try {
            const allContent = workspace.projects.map(p => p.description).join('\n') + 
                             workspace.scheduledPosts.map(p => p.content).join('\n');
            
            const refinedContent = await analyzeUserStyle(editedContent, allContent);
            setEditedContent(refinedContent);
        } catch (error) {
            console.error(error);
            alert('Não foi possível analisar seu estilo no momento.');
        } finally {
            setIsAnalyzing(false);
        }
    };


    const getSaveButtonText = () => {
        switch (saveStatus) {
            case 'saving': return 'Salvando...';
            case 'saved': return 'Salvo!';
            default: return 'Salvar Alterações';
        }
    };

    const handleNextStep = () => {
        if (tourStep < tourSteps.length - 1) {
            setTourStep(tourStep + 1);
        } else {
            setTourActive(false);
        }
    };
    
    const handlePrevStep = () => {
        if (tourStep > 0) {
            setTourStep(tourStep - 1);
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8">
            <header className="mb-6">
                <button onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-brand-dark-purple flex items-center gap-2 mb-4 transition-transform active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
                    Voltar
                </button>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif-display">{essencia.title}</h1>
                        <p className="text-gray-500">{essencia.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={handleAnalyzeStyle}
                            disabled={isAnalyzing}
                            className="px-4 py-2 bg-white border border-brand-lavender/80 text-brand-dark-purple rounded-md text-sm font-semibold hover:bg-brand-lavender/50 flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 disabled:opacity-50"
                        >
                            {isAnalyzing ? <SpinnerIcon/> : '✨'}
                            <span>Analisar Meu Estilo</span>
                        </button>
                         <button 
                            onClick={handleSave}
                            disabled={!isDirty || saveStatus !== 'idle'}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto ${
                                saveStatus === 'saved' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-brand-dark-purple text-white hover:bg-brand-dark-purple/90 disabled:bg-gray-400 disabled:cursor-not-allowed'
                            }`}
                        >
                            {saveStatus === 'saving' && <SpinnerIcon />}
                            {saveStatus === 'saved' && <CheckIcon />}
                            <span>{getSaveButtonText()}</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="border-b border-brand-lavender/50 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {essencia.fields.map(field => (
                            <button 
                                key={field.id}
                                onClick={() => setActiveField(field.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all duration-150 active:scale-95 ${activeField === field.id ? 'bg-brand-lavender/50 text-brand-dark-purple' : 'text-gray-500 hover:bg-brand-lavender/30 active:bg-brand-lavender/50'}`}
                            >
                                <field.icon className="w-4 h-4"/>
                                <span>{field.title}</span>
                                {field.autoGenerated && <div className="w-2 h-2 rounded-full bg-yellow-400" title="Gerado Automaticamente"></div>}
                            </button>
                        ))}
                    </div>
                     <div className="hidden sm:flex items-center gap-4 pl-4 flex-shrink-0">
                        <span className="text-sm text-gray-500">Tornar Padrão</span>
                        <button 
                            onClick={onSetDefault}
                            className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors duration-200 ease-in-out ${isDefault ? 'bg-brand-gold' : 'bg-brand-lavender/50'}`}
                            aria-pressed={isDefault}
                        >
                            <span className={`w-4 h-4 rounded-full bg-white shadow block transform transition-transform duration-200 ease-in-out ${isDefault ? 'translate-x-4' : 'translate-x-0'}`}></span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 bg-white border border-brand-lavender/50 rounded-lg">
                {currentField ? (
                     <textarea
                        key={currentField.id}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-full p-6 resize-none border-none focus:ring-0 text-sm leading-relaxed"
                        placeholder="Seja específica. Em vez de 'profissionais qualificadas', escreva 'nossa equipe é formada por esteticistas com pós-graduação em dermatologia estética'. Em vez de 'atendimento de qualidade', descreva: 'oferecemos uma sala climatizada com aromaterapia e uma playlist relaxante personalizada'. Detalhes criam diferenciação e alimentam a IA com o que realmente importa."
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>Selecione um campo para editar.</p>
                    </div>
                )}
            </main>

            {isTourActive && tourStep < tourSteps.length && (
                <TourModal
                    step={tourSteps[tourStep]}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                    isFirst={tourStep === 0}
                    isLast={tourStep === tourSteps.length - 1}
                    onClose={() => setTourActive(false)}
                />
            )}
        </div>
    )
}

export default EssenciaDetailView;
