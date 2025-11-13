
import React, { useState } from 'react';
import { navItems } from '../constants';
import { ActiveView, Workspace } from '../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSwitchWorkspace: (id: string) => void;
  onAddWorkspace: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen, onClose, workspaces, activeWorkspaceId, onSwitchWorkspace, onAddWorkspace }) => {
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length > 1) {
      return (words[0][0] + (words[1][0] || '')).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside className={`fixed inset-y-0 left-0 w-64 flex-shrink-0 bg-brand-white border-r border-brand-lavender/50 p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:static md:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <header className="px-2 mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-lavender via-brand-nude to-brand-lilac/80 flex items-center justify-center shadow-lg shadow-brand-lavender/50 relative">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 18h18v2H3v-2zM5.6 8.1l3.6 3.1 2.8-4.2 2.8 4.2 3.6-3.1 1.6 7.9H4l1.6-7.9z"/>
                  </svg>
              </div>
              <h1 className="text-2xl font-serif-display font-semibold text-brand-soft-black">Elevare</h1>
           </div>
        </header>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              if (item.isSectionTitle) {
                return (
                  <li key={index} className="pt-4 pb-1 px-2 text-xs font-bold uppercase text-gray-400 tracking-wider">
                    {item.name}
                  </li>
                );
              }

              const isActive = activeView === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => onNavigate(item.name)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-lavender/50 text-brand-dark-purple font-semibold shadow-inner'
                        : 'text-brand-graphite hover:bg-brand-lavender/30 active:bg-brand-lavender/50'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
                    <span className="flex-1">{item.name}</span>
                    {item.tag && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.tag === 'Novo!' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.tag}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

         <div className="mt-auto relative">
           {isWorkspaceOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-white border border-brand-lavender/50 rounded-lg shadow-lg py-1 z-10">
                  {workspaces.map(ws => (
                      <button 
                          key={ws.id}
                          onClick={() => { onSwitchWorkspace(ws.id); setIsWorkspaceOpen(false); }}
                          className="w-full text-left px-3 py-2 text-sm text-brand-graphite hover:bg-brand-lavender/30"
                      >
                          {ws.name}
                      </button>
                  ))}
                  <div className="my-1 border-t border-brand-lavender/50"></div>
                  <button 
                      onClick={() => { onAddWorkspace(); setIsWorkspaceOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-brand-dark-purple font-semibold hover:bg-brand-lavender/30"
                  >
                      + Novo Workspace
                  </button>
              </div>
           )}
           <button 
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md text-brand-graphite hover:bg-brand-lavender/30 transition-all duration-200"
          >
                <div className="w-8 h-8 bg-brand-lavender/50 rounded-full text-brand-dark-purple flex items-center justify-center font-semibold">
                    {activeWorkspace ? getInitials(activeWorkspace.name) : ''}
                </div>
                <span className="flex-1 text-left">{activeWorkspace?.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"></path></svg>
           </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
