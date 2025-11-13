import React from 'react';
import { NavItem, Essencia, Trilha, ScheduledPost, ContentSuggestion, Project, TrilhaCategory, ProjectTemplate, TourStep, JourneyStage, UserProfile } from './types';

// SVG Icons as React Components
const HomeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ChatIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const DnaIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.2 3.8a2.2 2.2 0 0 1 3.1 0l1.4 1.4a2.2 2.2 0 0 1 0 3.1L6.5 21.5a1.4 1.4 0 0 1-2 0L3.1 20.1a1.4 1.4 0 0 1 0-2l12.1-12.1z"></path><path d="M8.2 5.8a2.2 2.2 0 0 0-3.1 0L3.7 7.2a2.2 2.2 0 0 0 0 3.1l7.8 7.9a1.4 1.4 0 0 0 2 0l1.4-1.4a1.4 1.4 0 0 0 0-2L8.2 5.8z"></path></svg>;
const ProjectsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>;
const CompassIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const CameraIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>;
const CalendarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FeatherIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" x2="2" y1="8" y2="22" /><line x1="17.5" x2="9" y1="15" y2="15" /></svg>;
const BeakerIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>;
const AnalyticsIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><rect x="7" y="12" width="4" height="6" /><rect x="13" y="8" width="4" height="10" /><rect x="19" y="4" width="4" height="14" /></svg>;
const RocketIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.63-.42 1.25-.9 1.94-1.41.98-.73 2.22-1.22 3.51-1.33 2.23-.19 4.3 1.23 5.38 3.32.36.71.25 1.57-.29 2.14-1.25 1.34-3.32 2.81-5.32 3.9a1.5 1.5 0 0 1-1.23.23c-.26-.05-.48-.16-.69-.3-.59-.39-1.03-.93-1.3-1.58-.27-.65-.3-1.42-.04-2.11-.27-.27-.56-.53-.88-.77-.42-.32-.88-.59-1.38-.78a2.5 2.5 0 0 0-2.04-.15Z"/><path d="m22 2-7 2-3 7 2 2 7-3 2-7Z"/></svg>;
const JourneyIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
export const FeedbackIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const RadarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 0 0 3.34 17"/><path d="M20.66 17A10 10 0 0 0 17.38 4"/><path d="M12 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="M14 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z"/><path d="M12 12h.01"/></svg>;
const ToolIcon = ({ className = 'w-5 h-5' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>;


export const navItems: NavItem[] = [
  { name: 'Início', icon: HomeIcon },
  { name: 'Conversar com Lucresia', icon: ChatIcon },
  { name: 'Essência da Marca', icon: DnaIcon },
  { name: 'Projetos', icon: ProjectsIcon },
  { name: 'HUB', isSectionTitle: true },
  { name: 'Jornada da Cliente', icon: JourneyIcon },
  { name: 'Gerador de Pautas', icon: FeatherIcon },
  { name: 'Avaliador de Conteúdo', icon: BeakerIcon },
  { name: 'Analisador de Resultados', icon: AnalyticsIcon },
  { name: 'Analisador Sensorial', icon: RadarIcon },
  { name: 'Laboratório Elevare', icon: ToolIcon, tag: 'Novo!' },
  { name: 'Trilhas', icon: CompassIcon },
  { name: 'Estúdio Visual', icon: CameraIcon },
  { name: 'Calendário Editorial', icon: CalendarIcon },
  { name: 'Automação de Publicação', icon: RocketIcon, tag: 'Em Breve' },
];

export const essencias: Essencia[] = [
    {
        id: 'essencia-personalidade',
        title: 'Personalidade',
        description: 'Defina a voz e o tom da sua marca.',
        icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.22 5.22a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L5.22 6.28a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zM14.78 14.78a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM12.28 14.78a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM7.72 5.22a.75.75 0 010 1.06L6.66 7.34a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0110 18z" /><path d="M10 7a3 3 0 100 6 3 3 0 000-6z" /></svg>,
        fields: [
            { id: 'f1', title: 'Tom de Voz', icon: DnaIcon, content: 'Acolhedor, especialista e confiante.', autoGenerated: true },
            { id: 'f2', title: 'Valores', icon: DnaIcon, content: 'Ciência, Resultados, Cuidado Personalizado.' },
        ]
    },
    {
        id: 'essencia-publico',
        title: 'Público',
        description: 'Mapeie quem você quer atrair e converter.',
        icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131 2.095z" /></svg>,
        fields: [
            { id: 'f3', title: 'Público-Alvo', icon: DnaIcon, content: 'Mulheres, 30-45 anos, com poder aquisitivo, que valorizam resultados e se sentem frustradas com tratamentos que não funcionam.', autoGenerated: true },
            { id: 'f4', title: 'Dores Principais', icon: DnaIcon, content: 'Gordura localizada que não sai com dieta/academia; Flacidez pós-parto; Sinais de envelhecimento.' },
        ]
    },
    {
        id: 'essencia-produto',
        title: 'Produto/Serviço',
        description: 'Detalhe sua oferta e diferenciais únicos.',
        icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.337c-.626.618-.33 1.719.54 1.719h4.382l-2.922 5.123c-.506.884.21 1.95.955 1.597l8.23-4.699c.652-.372.29-1.396-.402-1.396h-3.032l2.12-3.712c.447-.783-.243-1.766-.922-1.428L10.868 2.884z" clipRule="evenodd" /></svg>,
        fields: [
            { id: 'f5', title: 'Diferenciais', icon: DnaIcon, content: 'Protocolos autorais, acompanhamento estético personalizado, tecnologia de ponta.' },
            { id: 'f6', title: 'Promessa', icon: DnaIcon, content: 'Um plano de tratamento claro e realista para remodelar o corpo, com segurança e ciência.', autoGenerated: true },
        ]
    },
];

export const trilhas: Trilha[] = [
    {
        id: 'trilha-conteudo',
        icon: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.191l-3.32 2.656a.75.75 0 01-1.178-.53V15H4.25A2.25 2.25 0 012 12.75v-8.5zM4.25 3.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h3a.75.75 0 01.75.75v2.19l2.72-2.176a.75.75 0 01.458-.164H15.75a.75.75 0 00.75-.75v-8.5a.75.75 0 00-.75-.75H4.25z" clipRule="evenodd" /></svg>,
        title: 'Criação de Conteúdo',
        description: 'Transforme ideias em posts que engajam e convertem com um fluxo guiado.',
        category: 'Criação de Conteúdo',
        steps: 5,
        lucresiaTip: "Comece definindo bem o objetivo do seu post. Isso guiará toda a criação e tornará sua mensagem mais eficaz.",
        templatePosts: [
            { dayOffset: 0, title: 'Ideia de Conteúdo', status: 'Ideia' },
            { dayOffset: 1, title: 'Rascunho Inicial', status: 'Rascunho' },
            { dayOffset: 2, title: 'Versão Final + Agendamento', status: 'Agendado' }
        ]
    },
    {
        id: 'trilha-vendas',
        icon: ChatIcon, // Changed from CycleIcon as it was removed
        title: 'Funil de Vendas Express',
        description: 'Crie um funil de vendas simples e eficaz para um serviço específico.',
        category: 'Vendas & Ofertas',
        steps: 4,
        action: 'CREATE_FUNNEL',
        whyItMatters: 'Um funil bem estruturado guia o cliente do interesse à compra, aumentando suas conversões sem esforço adicional.'
    },
    {
        id: 'trilha-fidelizacao',
        icon: ChatIcon,
        title: 'Pós-Venda que Encanta',
        description: 'Um guia para fidelizar clientes e transformá-los em fãs da sua marca.',
        category: 'Relacionamento & Fidelização',
        steps: 3,
        essentialElements: ['Mensagem de agradecimento personalizada', 'Pesquisa de satisfação rápida', 'Oferta exclusiva para próxima visita']
    }
];

export const initialProjects: Project[] = [
    { id: 'proj_1', name: "Lançamento 'Pele de Seda'", description: "Campanha de lançamento para o novo protocolo de hidratação profunda.", type: 'Campanha de Lançamento', tags: ['Hidratação', 'Novidade'], modified: new Date().toLocaleDateString('pt-BR'), status: 'Ativo' },
    { id: 'proj_2', name: "Conteúdo de Verão", description: "Planejamento de conteúdo para os meses de verão.", type: 'Planejamento de Conteúdo', tags: ['Verão', 'Cuidados'], modified: new Date().toLocaleDateString('pt-BR'), status: 'Planejamento' },
];

export const initialScheduledPosts: ScheduledPost[] = [
    { id: 'post_1', title: 'Boas-vindas ao Protocolo Pele de Seda', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], status: 'Agendado', content: 'Conteúdo do post sobre o protocolo pele de seda.', projectId: 'proj_1' },
    { id: 'post_2', title: 'Q&A sobre Criomodelagem', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], status: 'Rascunho', content: 'Rascunho do post de perguntas e respostas.', projectId: 'proj_1' },
    { id: 'post_3', title: 'Depoimento de Cliente', date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], status: 'Ideia', content: '' },
];

export const projectTemplates: ProjectTemplate[] = [
    {
        id: 'template_1',
        name: 'Lançamento de Novo Serviço',
        description: 'Um modelo completo para lançar um novo serviço, incluindo posts para redes sociais e e-mails.',
        type: 'Campanha de Lançamento',
        tags: ['Lançamento', 'Serviço'],
        templatePosts: [
            { dayOffset: 0, title: 'Anúncio Teaser', status: 'Rascunho' },
            { dayOffset: 2, title: 'Revelação do Serviço', status: 'Rascunho' },
            { dayOffset: 4, title: 'Benefícios e Diferenciais', status: 'Rascunho' },
            { dayOffset: 6, title: 'Prova Social (Depoimento)', status: 'Rascunho' },
            { dayOffset: 7, title: 'Chamada para Ação (Oferta Especial)', status: 'Rascunho' },
        ]
    },
    {
        id: 'template_2',
        name: 'Funil de Conteúdo para Instagram',
        description: 'Um funil de posts para aquecer a audiência e gerar leads no Instagram.',
        type: 'Funil de Vendas',
        tags: ['Instagram', 'Conteúdo'],
         templatePosts: [
            { dayOffset: 0, title: 'Post Topo de Funil (Atração)', status: 'Rascunho' },
            { dayOffset: 3, title: 'Post Meio de Funil (Relacionamento)', status: 'Rascunho' },
            { dayOffset: 6, title: 'Post Fundo de Funil (Oferta)', status: 'Rascunho' },
        ]
    }
];

export const welcomeTourSteps: TourStep[] = [
    {
        title: "Bem-vinda à Elevare!",
        content: "Este é o seu centro de comando. Vamos fazer um tour rápido para você conhecer as ferramentas que vão impulsionar seu negócio."
    },
    {
        title: "Essência da Marca",
        content: "Aqui você define a alma do seu negócio. A LucresIA usa essa essência para criar conteúdos únicos e alinhados com sua marca.",
    },
    {
        title: "HUB de Criação",
        content: "Acesse nossas ferramentas de IA para criar desde pautas e roteiros até análises estratégicas completas.",
    },
    {
        title: "Conversar com LucresIA",
        content: "Tem uma ideia? Precisa de ajuda? Converse diretamente com sua mentora de IA para refinar textos e ter insights.",
    },
    {
        title: "Pronta para começar?",
        content: "Explore, crie e eleve seu marketing. Estamos aqui para ajudar!"
    }
];


export const contentSuggestions: ContentSuggestion[] = [
    { id: 'sugg_1', title: 'Mitos e Verdades sobre skincare', category: 'Autoridade', prompt: 'Crie um post desmistificando 3 mitos comuns sobre cuidados com a pele no verão.' },
    { id: 'sugg_2', title: 'Enquete: Qual seu maior desafio?', category: 'Lifestyle', prompt: 'Gere um story interativo com uma enquete sobre os maiores desafios de beleza das clientes (ex: manchas, flacidez, acne).' },
    { id: 'sugg_3', title: 'Oferta Especial: Protocolo Detox', category: 'Vendas', prompt: 'Elabore uma oferta especial para o protocolo Detox Pós-Feriado, com senso de urgência.' },
];

// Icons for Journey Stages
const SearchIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const HelpCircleIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const CalendarCheckIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg>;
const ClipboardIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const HeartPlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3.01 5.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>;
const StarIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const UsersIcon = ({ className = 'w-6 h-6' }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M20 8v6" /><path d="M23 11h-6" /></svg>;

export const journeyStages: JourneyStage[] = [
    {
        id: 'descoberta',
        title: 'Descoberta',
        description: 'Como novas clientes encontram você?',
        icon: SearchIcon,
        mentorTip: 'Nesta fase, o foco é ser encontrada. Seu conteúdo deve resolver um problema inicial e apresentar sua autoridade de forma sutil. Pense em posts de blog, Reels educativos e posts otimizados para o Google.',
        generationPrompt: 'Crie um roteiro de Reel de 30 segundos para a fase de Descoberta. O objetivo é atrair mulheres (30-45 anos) que ainda não me conhecem mas sofrem com gordura localizada. O roteiro deve ser educativo, gerar curiosidade e terminar com um CTA para seguir o perfil.'
    },
    {
        id: 'consideracao',
        title: 'Consideração',
        description: 'Por que deveriam escolher você?',
        icon: HelpCircleIcon,
        mentorTip: 'Aqui, você precisa construir confiança e demonstrar seu diferencial. Use estudos de caso, posts de "mitos e verdades", e mostre os bastidores do seu método. A cliente precisa entender por que sua solução é a melhor para ela.',
        generationPrompt: 'Crie um post em carrossel de 4 slides para a fase de Consideração. O tema é "3 Mitos sobre Criomodelagem que te impedem de ter resultados". O objetivo é educar, quebrar objeções e posicionar meu método como a solução mais segura e eficaz.'
    },
    {
        id: 'agendamento',
        title: 'Agendamento',
        description: 'Como facilitar o primeiro passo?',
        icon: CalendarCheckIcon,
        mentorTip: 'O processo de agendamento deve ser o mais simples e claro possível. Use CTAs diretos, ofereça uma avaliação ou consulta inicial e deixe claro o que ela vai ganhar ao agendar. Remova qualquer atrito.',
        generationPrompt: 'Crie uma legenda curta e direta para um post de Instagram focado em Agendamento. O objetivo é levar a cliente a marcar uma avaliação para o protocolo "Flow Sculpt". Use um gatilho de urgência (vagas limitadas).'
    },
    {
        id: 'primeira_consulta',
        title: 'Primeira Consulta',
        description: 'Como encantar desde o primeiro contato?',
        icon: ClipboardIcon,
        mentorTip: 'A primeira consulta é onde a venda realmente acontece. Prepare-se para ouvir mais do que falar. O conteúdo de apoio aqui são materiais impressos de qualidade, formulários de anamnese detalhados e um ambiente acolhedor.',
        generationPrompt: 'Crie um roteiro de mensagem de WhatsApp para confirmar a primeira consulta de uma nova cliente. A mensagem deve ser acolhedora, reforçar o valor da consulta e dar instruções claras (ex: o que trazer, como chegar).'
    },
    {
        id: 'pos_tratamento',
        title: 'Pós-tratamento',
        description: 'Como continuar o cuidado e o relacionamento?',
        icon: HeartPlusIcon,
        mentorTip: 'O relacionamento não termina quando o procedimento acaba. Envie mensagens de acompanhamento, ofereça dicas de cuidados em casa e mostre que você se importa com os resultados dela a longo prazo. É aqui que você planta a semente da fidelização.',
        generationPrompt: 'Crie uma mensagem de WhatsApp para ser enviada 2 dias após um procedimento de criomodelagem. A mensagem deve ser cuidadosa, perguntar como a cliente está se sentindo e oferecer uma dica rápida de cuidado pós-procedimento.'
    },
    {
        id: 'fidelizacao',
        title: 'Fidelização',
        description: 'Como transformá-la em uma fã fiel?',
        icon: StarIcon,
        mentorTip: 'Clientes fiéis são o ativo mais valioso do seu negócio. Crie um programa de fidelidade, ofereça benefícios exclusivos para clientes recorrentes e lembre-se de datas especiais. Faça-a se sentir parte de um clube exclusivo.',
        generationPrompt: 'Crie um e-mail curto para uma cliente que não agenda um horário há 3 meses. O objetivo é reativá-la com uma oferta exclusiva de fidelidade para um tratamento complementar, com um tom de "sentimos sua falta".'
    },
    {
        id: 'indicacao',
        title: 'Indicação',
        description: 'Como incentivar que ela traga amigas?',
        icon: UsersIcon,
        mentorTip: 'Uma cliente satisfeita é sua melhor vendedora. Crie um programa de indicação simples e vantajoso para ambos os lados (quem indica e quem é indicado). Comunique ativamente esse programa para suas melhores clientes.',
        generationPrompt: 'Crie o texto para um pequeno cartão a ser entregue para clientes fiéis, explicando de forma clara e elegante o programa de indicação "Amiga-Parceira". O texto deve destacar os benefícios para ambas as partes.'
    },
];

export const mockUserProfile: UserProfile = {
    name: 'Carine M.',
    elo: 45,
    badges: [
        { id: 'b1', icon: '🚀', title: 'Primeiro Voo', description: 'Completou o tour de boas-vindas.' },
        { id: 'b2', icon: '✍️', title: 'Mestre das Palavras', description: 'Gerou 10 pautas com a LucresIA.' },
        { id: 'b3', icon: '🤝', title: 'Conectora', description: 'Indicou 3 novas colegas para a plataforma.' },
    ]
};