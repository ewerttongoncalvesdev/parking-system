import React, { useState, useEffect } from 'react';
import { Car, ParkingSquare, TrendingUp, DollarSign } from 'lucide-react';
import { vagasAPI } from '../services/api1';

type StatusVaga = 'livre' | 'ocupada' | 'manutencao';
type TipoVaga = 'carro' | 'moto' | 'deficiente';

interface Vaga {
    id: number;
    numero: string;
    status: StatusVaga;
    tipo: TipoVaga;
}

interface Estatisticas {
    total: number;
    ocupadas: number;
    livres: number;
    manutencao: number;
    percentual_ocupacao: number;
    receita_dia: number;
}

const Dashboard: React.FC = () => {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [estatisticas, setEstatisticas] = useState<Estatisticas>({
        total: 0,
        ocupadas: 0,
        livres: 0,
        manutencao: 0,
        percentual_ocupacao: 0,
        receita_dia: 0,
    });
    const [filtroStatus, setFiltroStatus] = useState<string>('');
    const [filtroTipo, setFiltroTipo] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const carregarDados = async (): Promise<void> => {
        try {
            // Promise.all executa as duas chamadas ao mesmo tempo
            const [vagasRes, estatRes] = await Promise.all([
                vagasAPI.listar(),
                vagasAPI.estatisticas(),
            ]);
            
            // Garante que se a resposta vier vazia, usamos um array vazio
            setVagas(vagasRes.data || []);
            // Garante que se estatísticas vierem nulas, mantemos o estado inicial
            setEstatisticas(estatRes.data || {
                total: 0, ocupadas: 0, livres: 0, manutencao: 0,
                percentual_ocupacao: 0, receita_dia: 0
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
        const interval = setInterval(carregarDados, 30000);
        return () => clearInterval(interval);
    }, []);

    const getCorStatus = (status: StatusVaga): string => {
        const cores = {
            livre: 'bg-green-500',
            ocupada: 'bg-red-500',
            manutencao: 'bg-gray-500'
        };
        return cores[status] || 'bg-gray-300';
    };

    const vagasFiltradas = vagas.filter((v) => {
        if (filtroStatus && v.status !== filtroStatus) return false;
        if (filtroTipo && v.tipo !== filtroTipo) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <div className="text-gray-600 font-medium">Carregando dados...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard 
                    title="Total de Vagas" 
                    value={estatisticas.total} 
                    icon={<ParkingSquare size={40} />} 
                    color="text-blue-500" 
                />
                <StatCard 
                    title="Ocupadas" 
                    value={estatisticas.ocupadas} 
                    icon={<Car size={40} />} 
                    color="text-red-500" 
                />
                <StatCard 
                    title="Livres" 
                    value={estatisticas.livres} 
                    icon={<TrendingUp size={40} />} 
                    color="text-green-500" 
                />
                <StatCard 
                    title="Receita do Dia" 
                    value={`R$ ${(estatisticas.receita_dia ?? 0).toFixed(2)}`} 
                    icon={<DollarSign size={40} />} 
                    color="text-yellow-600" 
                />
            </div>

            {/* Taxa de Ocupação */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Taxa de Ocupação</h3>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                        className="bg-blue-600 h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-1000"
                        style={{ width: `${estatisticas.percentual_ocupacao ?? 0}%` }}
                    >
                        {(estatisticas.percentual_ocupacao ?? 0).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Grid de Vagas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Mapa de Vagas</h3>
                    <div className="flex gap-2">
                        <select 
                            className="text-sm border rounded p-1"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="livre">Livre</option>
                            <option value="ocupada">Ocupada</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
                    {vagasFiltradas.map((vaga) => (
                        <div
                            key={vaga.id}
                            className={`${getCorStatus(vaga.status)} text-white p-3 rounded-lg text-center shadow-sm hover:scale-105 transition-transform cursor-default`}
                        >
                            <div className="font-bold text-lg">{vaga.numero}</div>
                            <div className="text-[10px] uppercase">{vaga.tipo}</div>
                        </div>
                    ))}
                </div>
                
                {vagasFiltradas.length === 0 && (
                    <div className="text-center py-10 text-gray-400">Nenhuma vaga encontrada.</div>
                )}
            </div>
        </div>
    );
};

// Sub-componente para os cards
const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-b-4 border-transparent hover:border-blue-400 transition-all">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-black text-gray-800">{value}</p>
            </div>
            <div className={color}>{icon}</div>
        </div>
    </div>
);

export default Dashboard;