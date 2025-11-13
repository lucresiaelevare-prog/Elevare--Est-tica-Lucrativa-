
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ConversaLucresiaView from './components/ConversaLucresiaView';
import EssenciaView from './components/DnasView';
import EssenciaDetailView from './components/DnaDetailView';
import ProjetosView from './components/ProjetosView';
import TrilhasView from './components/FluxosView';
import EstudioVisualView from './components/ImagesView';
import CalendarView from './components/CalendarView';
import PostModal from './components/PostModal';
import PilotoAutomaticoModal from './components/PilotoAutomaticoModal';
import FeedbackModal from './components/FeedbackModal';
import { ActiveView, Trilha, Essencia, ScheduledPost, PostPerformance, Project, Workspace, ProjectTemplate, Toast as ToastType, JourneyStage, CompetitorAnalysisOutput } from './types';
import { essencias as initialEssencias, trilhas, initialScheduledPosts, initialProjects, projectTemplates, welcomeTourSteps } from './constants';
import TrilhaDetailModal from './components/TrilhaDetailModal';
import ProjectModal from './components/ProjectModal';
import ProjectDetailView from './components/ProjectDetailView';
import ProjectTemplateModal from './components/ProjectTemplateModal';
import GeradorDePautasView from './components/GeradorDePautasView';
import AvaliadorDeConteudoView from './components/AvaliadorDeConteudoView';
import AnalisadorDeResultadosView from './components/AnalisadorDeResultadosView';
import TourModal from './components/TourModal';
import Toast from './components/Toast';
import AutomacaoView from './components/AutomacaoView';
import JornadaView from './components/JornadaView';
import JornadaStageModal from './components/JornadaStageModal';
import AnalisadorSensorialView from './components/AnalisadorSensorialView';
import LaboratorioView from './components/LaboratorioView';

declare global {
  interface Window {
    Lucresia: {
      showWelcome: (sectorId: string, sectorName: string) => void;
    };
  }
}

const initialWorkspace: Workspace = {
  id: `ws_${Date.now()}`,
  name: 'Esteticista M.',
  essencias: initialEssencias,
  projects: initialProjects,
  scheduledPosts: initialScheduledPosts,
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('Início');
  const [selectedTrilha, setSelectedTrilha] = useState<Trilha | null>(null);
  const [chatContext, setChatContext] = useState<string | null>(null);
  const [initialUserMessage, setInitialUserMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedJourneyStage, setSelectedJourneyStage] = useState<JourneyStage | null>(null);


  // Toast State
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = (message: string, type: ToastType['type'] = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Tour State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('elevare-tour-completed');
    if (!tourCompleted) {
      setIsTourActive(true);
    }
  }, []);

  const handleTourNext = () => {
    if (tourStep < welcomeTourSteps.length - 1) {
      setTourStep(s => s + 1);
    } else {
      setIsTourActive(false);
      localStorage.setItem('elevare-tour-completed', 'true');
    }
  };
  
  // WORKSPACE STATE MANAGEMENT
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    try {
      const saved = localStorage.getItem('elevare-workspaces');
      return saved ? JSON.parse(saved) : [initialWorkspace];
    } catch (error) {
      console.error("Failed to parse workspaces from localStorage", error);
      return [initialWorkspace];
    }
  });
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(workspaces[0].id);

  useEffect(() => {
    try {
      localStorage.setItem('elevare-workspaces', JSON.stringify(workspaces));
    } catch (error) {
      console.error("Failed to save workspaces to localStorage", error);
    }
  }, [workspaces]);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  const updateActiveWorkspace = (updater: (workspace: Workspace) => Workspace) => {
    setWorkspaces(prev => prev.map(ws => ws.id === activeWorkspaceId ? updater(ws) : ws));
  };

  const [selectedEssenciaId, setSelectedEssenciaId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectTemplateModalOpen, setIsProjectTemplateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<ScheduledPost> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [pilotoModalState, setPilotoModalState] = useState<{isOpen: boolean; theme?: string}>({isOpen: false});
  const [feedbackPost, setFeedbackPost] = useState<ScheduledPost | null>(null);

  // LucresIA Welcome Module Integration
  useEffect(() => {
    if (window.Lucresia) {
      let sectorId: string | null = null;
      let sectorName: string = activeView;

      switch (activeView) {
        case 'Essência da Marca': sectorId = 'essencia-da-marca'; break;
        case 'Gerador de Pautas': sectorId = 'gerador-de-pautas'; break;
        case 'Calendário Editorial': sectorId = 'calendario-editorial'; break;
        case 'Projetos': sectorId = 'projetos'; break;
        case 'Avaliador de Conteúdo': sectorId = 'avaliador-de-conteudo'; break;
        case 'Analisador de Resultados': sectorId = 'analisador-de-resultados'; break;
        case 'Analisador Sensorial': sectorId = 'analisador-sensorial'; break;
        case 'Jornada da Cliente': sectorId = 'jornada-da-cliente'; break;
        case 'Trilhas': sectorId = 'trilhas'; break;
      }
      
      if (sectorId) {
        window.Lucresia.showWelcome(sectorId, sectorName);
      }
    }
  }, [activeView]);


  const handleUpdateEssenciaField = (essenciaId: string, fieldId: string, newContent: string) => {
    updateActiveWorkspace(ws => ({
      ...ws,
      essencias: ws.essencias.map(essencia => {
        if (essencia.id === essenciaId) {
          return {
            ...essencia,
            fields: essencia.fields.map(field =>
              field.id === fieldId ? { ...field, content: newContent } : field
            )
          };
        }
        return essencia;
      })
    }));
  };
  
  const handleSetDefaultEssencia = (essenciaId: string) => {
      updateActiveWorkspace(ws => ({
        ...ws,
        defaultEssenciaId: ws.defaultEssenciaId === essenciaId ? undefined : essenciaId,
      }));
  };

  const handleSaveProject = (project: Project) => {
    const isEditing = !!project.id && activeWorkspace.projects.some(p => p.id === project.id);
    updateActiveWorkspace(ws => {
      return {
        ...ws,
        projects: isEditing ? ws.projects.map(p => p.id === project.id ? project : p) : [...ws.projects, project]
      };
    });
    setIsProjectModalOpen(false);
    setEditingProject(null);
    showToast(isEditing ? 'Projeto salvo com sucesso!' : 'Projeto criado com sucesso!');
  };

  const handleSavePost = (post: ScheduledPost) => {
    updateActiveWorkspace(ws => {
      const existing = ws.scheduledPosts.find(p => p.id === post.id);
      return {
        ...ws,
        scheduledPosts: existing ? ws.scheduledPosts.map(p => p.id === post.id ? post : p) : [...ws.scheduledPosts, post]
      };
    });
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  const handleAddPost = (date: string) => {
    const postData: Partial<ScheduledPost> = { date, status: 'Ideia' };
    if (selectedProjectId) {
      postData.projectId = selectedProjectId;
    }
    setEditingPost(postData);
    setIsPostModalOpen(true);
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setIsPostModalOpen(true);
  };
  
  const handleAddProject = () => {
    setEditingProject({ status: 'Planejamento' });
    setIsProjectModalOpen(true);
  };

  const handleViewProjectDetails = (projectId: string) => {
      setSelectedProjectId(projectId);
      setActiveView('Projetos');
  }

  const handleCreateProjectFromTemplate = (template: ProjectTemplate) => {
    const projectName = prompt(`Nome para o novo projeto (baseado em "${template.name}"):`, template.name);
    if (!projectName) return;

    updateActiveWorkspace(ws => {
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name: projectName,
        description: template.description,
        type: template.type,
        tags: template.tags,
        status: 'Planejamento',
        modified: new Date().toLocaleDateString('pt-BR'),
      };

      const today = new Date();
      const newPosts: ScheduledPost[] = (template.templatePosts || []).map((postTemplate, index) => {
        const postDate = new Date(today);
        postDate.setDate(today.getDate() + postTemplate.dayOffset);
        return {
          id: `post_${Date.now()}_${index}`,
          title: postTemplate.title,
          date: postDate.toISOString().split('T')[0],
          status: postTemplate.status || 'Rascunho',
          content: postTemplate.content || '',
          projectId: newProject.id,
        };
      });

      return {
        ...ws,
        projects: [...ws.projects, newProject],
        scheduledPosts: [...ws.scheduledPosts, ...newPosts],
      };
    });
    setIsProjectTemplateModalOpen(false);
    showToast('Projeto e posts do calendário criados com sucesso!');
  };

  const handleSaveFeedback = (postId: string, performance: PostPerformance) => {
    updateActiveWorkspace(ws => ({
      ...ws,
      scheduledPosts: ws.scheduledPosts.map(p => p.id === postId ? { ...p, performance } : p)
    }));
    setFeedbackPost(null);
  };

  const handleOpenPilotoModal = (theme?: string) => {
      setPilotoModalState({ isOpen: true, theme });
  };
  
  const handleAddWorkspace = () => {
    const name = prompt("Nome do novo Workspace:", `Cliente ${workspaces.length + 1}`);
    if (name) {
      const newWorkspace: Workspace = {
        id: `ws_${Date.now()}`,
        name,
        essencias: initialEssencias,
        projects: [],
        scheduledPosts: []
      };
      setWorkspaces(prev => [...prev, newWorkspace]);
      setActiveWorkspaceId(newWorkspace.id);
    }
  };

  const handleActivateTrilha = (trilha: Trilha, projectName: string) => {
    if (!trilha.templatePosts) return;

    updateActiveWorkspace(ws => {
        const newProject: Project = {
            id: `proj_${Date.now()}`,
            name: projectName,
            description: `Projeto gerado a partir da trilha: ${trilha.title}`,
            type: 'Planejamento de Conteúdo',
            tags: [trilha.category, trilha.title],
            status: 'Planejamento',
            modified: new Date().toLocaleDateString('pt-BR'),
        };

        const today = new Date();
        const newPosts: ScheduledPost[] = trilha.templatePosts.map((template, index) => {
            const postDate = new Date(today);
            postDate.setDate(today.getDate() + template.dayOffset);
            
            return {
                id: `post_${Date.now()}_${index}`,
                title: template.title,
                date: postDate.toISOString().split('T')[0],
                status: template.status || 'Rascunho',
                content: template.content || '',
                projectId: newProject.id,
            };
        });

        return {
            ...ws,
            projects: [...ws.projects, newProject],
            scheduledPosts: [...ws.scheduledPosts, ...newPosts]
        };
    });
    
    showToast(`Trilha ativada! Projeto criado e ${trilha.templatePosts.length} posts adicionados.`);
    setActiveView('Calendário Editorial');
  };
  
  const handleAutoRefine = (content: string, prompt: string) => {
    setChatContext(content);
    setInitialUserMessage(prompt);
    setActiveView('Conversar com Lucresia');
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  }

  const renderContent = () => {
    if (activeView === 'Essência da Marca' && selectedEssenciaId) {
        const essencia = activeWorkspace.essencias.find(e => e.id === selectedEssenciaId);
        if (essencia) {
            return <EssenciaDetailView 
                      essencia={essencia} 
                      onBack={() => setSelectedEssenciaId(null)} 
                      onUpdateField={handleUpdateEssenciaField}
                      isDefault={activeWorkspace.defaultEssenciaId === essencia.id}
                      onSetDefault={() => handleSetDefaultEssencia(essencia.id)}
                      workspace={activeWorkspace}
                    />;
        }
    }
    
    if (activeView === 'Projetos' && selectedProjectId) {
      const project = activeWorkspace.projects.find(p => p.id === selectedProjectId);
      if (project) {
        return <ProjectDetailView 
                  project={project} 
                  posts={activeWorkspace.scheduledPosts.filter(p => p.projectId === selectedProjectId)}
                  onBack={() => setSelectedProjectId(null)} 
                  onEditProject={() => { setEditingProject(project); setIsProjectModalOpen(true); }}
                  onAddPost={() => handleAddPost(new Date().toISOString().split('T')[0])}
                />
      }
    }
      
    switch (activeView) {
      case 'Início':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'Conversar com Lucresia':
        return <ConversaLucresiaView 
                    initialContext={chatContext} 
                    initialUserMessage={initialUserMessage}
                    onClearContext={() => setChatContext(null)} 
                    onClearInitialMessage={() => setInitialUserMessage(null)}
                    essencias={activeWorkspace.essencias}
                    defaultEssenciaId={activeWorkspace.defaultEssenciaId}
                    onNavigate={handleNavigate}
                    onAddProject={handleAddProject}
                />;
      case 'Essência da Marca':
        return <EssenciaView essencias={activeWorkspace.essencias} onSelectEssencia={setSelectedEssenciaId} />;
      case 'Projetos':
        return <ProjetosView 
                  projects={activeWorkspace.projects} 
                  onAddProject={handleAddProject} 
                  onViewProjectDetails={setSelectedProjectId}
                  onOpenTemplateModal={() => setIsProjectTemplateModalOpen(true)}
                />;
      case 'Gerador de Pautas':
        return <GeradorDePautasView />;
      case 'Avaliador de Conteúdo':
        return <AvaliadorDeConteudoView />;
      case 'Analisador de Resultados':
        return <AnalisadorDeResultadosView />;
      case 'Analisador Sensorial':
        return <AnalisadorSensorialView />;
      case 'Laboratório Elevare':
        return <LaboratorioView onNavigate={handleNavigate} />;
      case 'Trilhas':
        return <TrilhasView onSelectTrilha={setSelectedTrilha} />;
       case 'Calendário Editorial':
        return <CalendarView 
                    posts={activeWorkspace.scheduledPosts} 
                    essencias={activeWorkspace.essencias}
                    onAddPost={handleAddPost} 
                    onEditPost={handleEditPost} 
                    onOpenFeedbackModal={setFeedbackPost} 
                    onLaunchPiloto={handleOpenPilotoModal} 
                />;
      case 'Estúdio Visual':
        return <EstudioVisualView />;
      case 'Automação de Publicação':
        return <AutomacaoView />;
      case 'Jornada da Cliente':
        return <JornadaView onSelectStage={setSelectedJourneyStage} />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-sand text-brand-soft-black">
      <Sidebar 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSwitchWorkspace={setActiveWorkspaceId}
        onAddWorkspace={handleAddWorkspace}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
         <Header activeView={activeView} onToggleSidebar={() => setIsSidebarOpen(true)} />
         <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      <div className="fixed top-5 right-5 z-[100] space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {isTourActive && tourStep < welcomeTourSteps.length && (
        <TourModal
            step={welcomeTourSteps[tourStep]}
            onNext={handleTourNext}
            onPrev={tourStep > 0 ? () => setTourStep(s => s - 1) : undefined}
            isFirst={tourStep === 0}
            isLast={tourStep === welcomeTourSteps.length - 1}
            onClose={() => {
                setIsTourActive(false);
                localStorage.setItem('elevare-tour-completed', 'true');
            }}
        />
      )}

      {selectedTrilha && (
        <TrilhaDetailModal 
          isOpen={!!selectedTrilha}
          onClose={() => setSelectedTrilha(null)}
          trilha={selectedTrilha}
          onActivateTrilha={handleActivateTrilha}
        />
      )}
      
      {selectedJourneyStage && (
        <JornadaStageModal
          isOpen={!!selectedJourneyStage}
          onClose={() => setSelectedJourneyStage(null)}
          stage={selectedJourneyStage}
          onGenerate={(prompt) => {
            setInitialUserMessage(prompt);
            setActiveView('Conversar com Lucresia');
            setSelectedJourneyStage(null);
          }}
        />
      )}

       {isPostModalOpen && editingPost && (
        <PostModal 
          isOpen={isPostModalOpen}
          onClose={() => { setIsPostModalOpen(false); setEditingPost(null); }}
          onSave={handleSavePost}
          post={editingPost}
        />
      )}
      
      {isProjectModalOpen && editingProject && (
          <ProjectModal
            isOpen={isProjectModalOpen}
            onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
            onSave={handleSaveProject}
            project={editingProject}
          />
      )}

      {isProjectTemplateModalOpen && (
        <ProjectTemplateModal
          isOpen={isProjectTemplateModalOpen}
          onClose={() => setIsProjectTemplateModalOpen(false)}
          templates={projectTemplates}
          onCreate={handleCreateProjectFromTemplate}
        />
      )}

      {pilotoModalState.isOpen && (
        <PilotoAutomaticoModal
          isOpen={pilotoModalState.isOpen}
          onClose={() => setPilotoModalState({ isOpen: false })}
          initialTheme={pilotoModalState.theme}
        />
      )}

      {feedbackPost && (
        <FeedbackModal
            isOpen={!!feedbackPost}
            onClose={() => setFeedbackPost(null)}
            onSave={handleSaveFeedback}
            post={feedbackPost}
        />
      )}
    </div>
  );
};

export default App;
