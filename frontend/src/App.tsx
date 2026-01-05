import React, { useState } from 'react';
import { ParkingSquare } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Movimentacoes from './components/Movimentacoes';
import Gestao from './components/Gestao';

type TabId = 'dashboard' | 'movimentacoes' | 'gestao';

interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

const App: React.FC = () => {
  // Inicializando o estado com o tipo definido
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const tabs: TabConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'movimentacoes', label: 'Movimentações', icon: '🚗' },
    { id: 'gestao', label: 'Gestão', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <ParkingSquare size={40} className="animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold">
                Sistema de Gestão de Estacionamento
              </h1>
              <p className="text-blue-100 text-sm">
                Controle completo de vagas e movimentações
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'movimentacoes' && <Movimentacoes />}
        {activeTab === 'gestao' && <Gestao />}
      </main>

    </div>
  );
}

export default App;