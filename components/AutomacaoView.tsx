import React from 'react';

const MetaIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.08,10.63a1,1,0,0,0-.8-0.21,11.6,11.6,0,0,0-18.55,0,1,1,0,0,0-.79.21,1,1,0,0,0-.36,1L3.1,15.71a1,1,0,0,0,1,.83,11.6,11.6,0,0,0,14.82,0,1,1,0,0,0,1-.83l1.52-4.09A1,1,0,0,0,22.08,10.63ZM12,14.54a2.91,2.91,0,1,1,2.91-2.91A2.91,2.91,0,0,1,12,14.54Z"/>
    </svg>
);

const GoogleIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.35,11.1H12.18V13.83H18.69c-.69,2.23-2.82,3.78-5.87,3.78-3.55,0-6.42-2.88-6.42-6.42s2.87-6.42,6.42-6.42c2,0,3.26,0.83,4,1.58l2.13-2.13C18.3,2.49,15.54,1,12.18,1,7.03,1,3,5.03,3,10s4.03,9,9.18,9c4.89,0,8.8-3.81,8.8-8.82,0-.61-.06-1.22-.18-1.82Z"/>
    </svg>
);

const ClockIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const WhatsAppIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.46 3.45 1.28 4.92L2 22l5.25-1.38c1.41.74 3 .93 4.5.93h.01c5.56 0 10-4.45 10-9.91S17.6 2 12.04 2m.01 1.66c4.68 0 8.48 3.8 8.48 8.48 0 4.68-3.8 8.48-8.48 8.48h-.01c-1.48 0-2.92-.38-4.18-1.09l-.3-.18-3.1.82.83-3.03-.2-.31c-.8-1.29-1.21-2.79-1.21-4.38 0-4.68 3.8-8.48 8.48-8.48m4.09 5.37c-.22-.11-.46-.18-.78-.33-.32-.15-1.88-0.93-2.17-1.04s-.49-.16-.7.16c-.21.32-.82 1.04-.1 1.27s.37.26.42.42c.05.16.02.3-.04.42-.06.12-.22.33-.46.57s-.49.49-.66.65c-.17.16-.34.33-.51.22-.17-.11-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.69s-.02-.38.11-.51c.11-.11.26-.26.38-.38s.16-.21.24-.34c.08-.13.04-.26-.02-.38-.06-.11-1.22-2.93-1.68-4.01-.44-1.05-.88-.91-1.2-.93s-.63-.05-.96-.05c-.32 0-.85.11-1.28.53s-1.68 1.63-1.68 3.98c0 2.35 1.72 4.61 1.96 4.92.24.3 3.39 5.16 8.21 7.23 1.13.48 2.02.77 2.71 1 1.04.33 1.99.29 2.74.18.83-.12 2.63-1.08 3-2.11.37-1.04.37-1.92.26-2.11s-.34-.3-.55-.42Z"/>
    </svg>
);

const AutomacaoView: React.FC = () => {
    const features = [
        {
            icon: MetaIcon,
            title: 'Integração com Meta API (Instagram/Facebook)',
            description: 'Agende e publique seus posts, Reels e Stories diretamente na Elevare, sem precisar trocar de plataforma.',
            color: 'text-pink-500'
        },
        {
            icon: GoogleIcon,
            title: 'Geração de Rascunhos no Google Business Profile',
            description: 'Mantenha seu perfil local sempre atualizado. A LucresIA gera posts otimizados e os envia como rascunho para sua aprovação final.',
            color: 'text-blue-500'
        },
        {
            icon: ClockIcon,
            title: 'Agendamento Direto e Inteligente',
            description: 'Nossa infraestrutura robusta garante que seu conteúdo seja publicado na hora certa, sempre, otimizando o alcance e o engajamento.',
            color: 'text-purple-500'
        },
        {
            icon: WhatsAppIcon,
            title: 'Lembretes via WhatsApp',
            description: 'Receba notificações amigáveis como: "Seu post do dia está pronto. Quer revisar ou publicar agora com um toque?".',
            color: 'text-green-500'
        }
    ];

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-brand-sand">
            <header className="text-center mb-10 md:mb-12">
                <div className="inline-block bg-brand-lavender/50 p-4 rounded-full mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-brand-dark-purple"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.63-.42 1.25-.9 1.94-1.41.98-.73 2.22-1.22 3.51-1.33 2.23-.19 4.3 1.23 5.38 3.32.36.71.25 1.57-.29 2.14-1.25 1.34-3.32 2.81-5.32 3.9a1.5 1.5 0 0 1-1.23.23c-.26-.05-.48-.16-.69-.3-.59-.39-1.03-.93-1.3-1.58-.27-.65-.3-1.42-.04-2.11-.27-.27-.56-.53-.88-.77-.42-.32-.88-.59-1.38-.78a2.5 2.5 0 0 0-2.04-.15Z"/><path d="m22 2-7 2-3 7 2 2 7-3 2-7Z"/></svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif-display text-brand-soft-black">Automação de Publicação</h1>
                <p className="text-brand-graphite/80 mt-2 text-base md:text-lg max-w-2xl mx-auto">Conecte suas contas, automatize suas publicações e ganhe de volta o seu tempo mais precioso.</p>
                <span className="inline-block mt-4 text-sm font-bold bg-yellow-200 text-yellow-800 px-4 py-1.5 rounded-full">EM BREVE</span>
            </header>
            
            <main className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white border border-brand-lavender/50 rounded-xl p-6 flex items-start gap-5 shadow-subtle hover:shadow-lg hover:border-brand-lilac transition-all duration-200 hover:-translate-y-1">
                            <div className={`flex-shrink-0 ${feature.color}`}>
                                <feature.icon />
                            </div>
                            <div>
                                <h3 className="font-bold text-brand-soft-black text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-gradient-to-br from-brand-lavender/40 via-white to-brand-nude/30 border border-brand-lavender/50 rounded-2xl">
                    <h2 className="text-xl md:text-2xl font-serif-display font-semibold text-brand-dark-purple mb-3">Quer ser a primeira a saber?</h2>
                    <p className="text-brand-graphite mb-6 max-w-lg mx-auto">Esta funcionalidade está em desenvolvimento final. Deixe seu e-mail para receber acesso antecipado e um bônus especial de lançamento.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input type="email" placeholder="Seu melhor e-mail" className="flex-1 px-4 py-3 border border-brand-lavender/80 rounded-lg focus:ring-2 focus:ring-brand-dark-purple focus:outline-none" />
                        <button className="px-6 py-3 bg-brand-dark-purple text-white rounded-lg font-semibold hover:bg-brand-dark-purple/90 transition-all duration-150 active:scale-95 shadow-md shadow-brand-dark-purple/30">
                            Quero acesso antecipado!
                        </button>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AutomacaoView;