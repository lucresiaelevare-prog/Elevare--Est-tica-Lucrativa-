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
import { ActiveView, Trilha, Essencia, ScheduledPost, PostPerformance, Project, Workspace, ProjectTemplate, Toast as ToastType, JourneyStage, CompetitorAnalysisOutput, ContentSuggestion } from './types';
import { essencias as initialEssencias, trilhas, initialScheduledPosts, initialProjects, projectTemplates, welcomeTourSteps } from './constants';
import TrilhaDetailModal from './components/TrilhaDetailModal';
import ProjectModal from './components/ProjectModal';
import ProjectDetailView from './components/ProjectDetailView';
import ProjectTemplateModal from './components/ProjectTemplateModal';
import GeradorDePautasView from './components/GeradorDePautasView';
import HubDeAnaliseView from './components/HubDeAnaliseView';
import TourModal from './components/TourModal';
import Toast from './components/Toast';
import AutomacaoView from './components/AutomacaoView';
import JornadaView from './components/JornadaView';
import JornadaStageModal from './components/JornadaStageModal';
import LaboratorioView from './components/LaboratorioView';

declare global {
  interface Window {
    Lucresia: {
      showWelcome: (sectorId: string, sectorName: string) => void;
    };
  }
}

const DnaIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.2 3.8a2.2 2.2 0 0 1 3.1 0l1.4 1.4a2.2 2.2 0 0 1 0 3.1L6.5 21.5a1.4 1.4 0 0 1-2 0L3.1 20.1a1.4 1.4 0 0 1 0-2l12.1-12.1z"></path><path d="M8.2 5.8a2.2 2.2 0 0 0-3.1 0L3.7 7.2a2.2 2.2 0 0 0 0 3.1l7.8 7.9a1.4 1.4 0 0 0 2 0l1.4-1.4a1.4 1.4 0 0 0 0-2L8.2 5.8z"></path></svg>;

const initialWorkspace: Workspace = {
  id: `ws_${Date.now()}`,
  name: 'Esteticista M.',
  essencias: initialEssencias,
  projects: initialProjects,
  scheduledPosts: initialScheduledPosts,
};

const loadAndValidateWorkspaces = (): { workspaces: Workspace[]; activeId: string } => {
  const initial = { workspaces: [initialWorkspace], activeId: initialWorkspace.id };
  try {
    const savedWorkspaces = localStorage.getItem('elevare-workspaces');
    if (!savedWorkspaces) return initial;

    const parsed = JSON.parse(savedWorkspaces);
    if (!Array.isArray(parsed) || parsed.length === 0) return initial;
    
    // Deep validation and migration for each workspace to prevent crashes
    const validatedWorkspaces = parsed.map((ws: Partial<Workspace>) => {
      const projects = (Array.isArray(ws.projects) ? ws.projects : []).map(p => ({
        ...p,
        // Add default/missing properties for backward compatibility
        goal: p.goal || '',
      }));

      const essencias = (Array.isArray(ws.essencias) ? ws.essencias : initialEssencias).map(e => {
        const initialMatch = initialEssencias.find(ie => ie.id === e.id);
        return {
          ...e,
          icon: initialMatch?.icon || DnaIcon, // Restore icon function
          fields: (Array.isArray(e.fields) ? e.fields : []).map(f => ({
            ...f,
            // Restore field icon function from constants or fallback to DnaIcon
            icon: initialMatch?.fields.find(iff => iff.id === f.id)?.icon || DnaIcon
          }))
        };
      });

      return {
        id: ws.id || `ws_${Date.now()}`,
        name: ws.name || 'Workspace',
        essencias: essencias,
        projects: projects,
        scheduledPosts: Array.isArray(ws.scheduledPosts) ? ws.scheduledPosts : [],
        defaultEssenciaId: ws.defaultEssenciaId,
      };
    });
    
    // Validate active workspace ID
    let activeId = localStorage.getItem('elevare-active-workspace-id');
    if (!activeId || !validatedWorkspaces.some(ws => ws.id === activeId)) {
      activeId = validatedWorkspaces[0].id;
    }
    
    localStorage.setItem('elevare-active-workspace-id', activeId);
    return { workspaces: validatedWorkspaces, activeId };

  } catch (error) {
    console.error("Failed to load or validate workspaces, resetting to default.", error);
    localStorage.removeItem('elevare-workspaces');
    localStorage.removeItem('elevare-active-workspace-id');
    return initial;
  }
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
  const [{ workspaces, activeId: initialActiveId }] = useState(loadAndValidateWorkspaces);
  const [workspacesState, setWorkspaces] = useState<Workspace[]>(workspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(initialActiveId);

  useEffect(() => {
    try {
      localStorage.setItem('elevare-workspaces', JSON.stringify(workspacesState));
      localStorage.setItem('elevare-active-workspace-id', activeWorkspaceId);
    } catch (error) {
      console.error("Failed to save workspaces to localStorage", error);
    }
  }, [workspacesState, activeWorkspaceId]);

  const activeWorkspace = workspacesState.find(w => w.id === activeWorkspaceId) || workspacesState[0];

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
  const [pilotoModalState, setPilotoModalState] = useState<{isOpen: boolean; suggestion?: ContentSuggestion}>({isOpen: false});
  const [feedbackPost, setFeedbackPost] = useState<ScheduledPost | null>(null);

  // Robustness: Effect to validate selected items against the current workspace
  useEffect(() => {
    if (!activeWorkspace) return;

    if (activeView === 'Projetos' && selectedProjectId) {
        const projectExists = activeWorkspace.projects.some(p => p.id === selectedProjectId);
        if (!projectExists) {
            setSelectedProjectId(null);
            showToast("O projeto selecionado não foi encontrado ou foi excluído.", "error");
        }
    }
    if (activeView === 'Essência da Marca' && selectedEssenciaId) {
        const essenciaExists = activeWorkspace.essencias.some(e => e.id === selectedEssenciaId);
        if (!essenciaExists) {
            setSelectedEssenciaId(null);
            showToast("A essência selecionada não foi encontrada ou foi excluída.", "error");
        }
    }
  }, [activeWorkspace, activeView, selectedProjectId, selectedEssenciaId]);


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
  
  const handleSavePostFromPiloto = (postData: Partial<ScheduledPost>) => {
    const newPost: ScheduledPost = {
        id: `post_${Date.now()}`,
        title: postData.title || 'Novo Post',
        date: postData.date!,
        status: postData.status || 'Rascunho',
        content: postData.content || '',
    };
    handleSavePost(newPost);
    showToast('Post salvo como rascunho no seu calendário!', 'success');
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

  const handleOpenPilotoModal = (suggestion: ContentSuggestion) => {
      setPilotoModalState({ isOpen: true, suggestion });
  };
  
  const handleAddWorkspace = () => {
    const name = prompt("Nome do novo Workspace:", `Cliente ${workspacesState.length + 1}`);
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
    if (!activeWorkspace) {
        return <div className="p-8">Carregando Workspace...</div>; // Safety net
    }

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
                  onSelectProject={setSelectedProjectId}
                  onOpenTemplateModal={() => setIsProjectTemplateModalOpen(true)}
                />;
      case 'Gerador de Pautas':
        return <GeradorDePautasView />;
      case 'HUB de Análise':
        return <HubDeAnaliseView />;
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
        workspaces={workspacesState}
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
          suggestion={pilotoModalState.suggestion || null}
          onSavePost={handleSavePostFromPiloto}
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