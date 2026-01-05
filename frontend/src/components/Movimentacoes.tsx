import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, RefreshCw, Car } from 'lucide-react';
import { MovimentacoesAPI, vagasAPI } from '../services/api1';
import ModalEntrada from './modals/ModalEntrada';
import ModalSaida from './modals/ModalSaida';


// Tipo de veiculo
type TipoVeiculo = 'carro' | 'moto';
type TipoVaga = 'carro' | 'moto' | 'deficiente';
type StatusVaga = 'livre' | 'ocupada' | 'manutencao';

interface Vaga {
    id: number;
    numero: string;
    status: StatusVaga;
    tipo: TipoVaga;
}

interface Movimentacao {
    id: number;
    placa: string;
    vaga_id: number;
    tipo_veiculo: TipoVeiculo;
    entrada: string;
    saida?: string | null;
}

const Movimentacoes: React.FC = () => {
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModalEntrada, setShowModalEntrada] = useState<boolean>(false);
    const [showModalSaida, setShowModalSaida] = useState<boolean>(false);

    useEffect(() => {
        carregarDados();
        const interval = setInterval(carregarDados, 10000); // Atualiza a cada 10s
        return () => clearInterval(interval);
    }, []);

    const carregarDados = async (): Promise<void> => {
        try {
            const [movRes, vagasRes] = await Promise.all([
                MovimentacoesAPI.listarAtivas(),
                vagasAPI.listar(),
            ]);
            setMovimentacoes(movRes.data);
            setVagas(vagasRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const calcularTempo = (entrada: string): string => {
        const entradaDate = new Date(entrada);
        const agora = new Date();
        const minutos = Math.floor((agora.getTime() - entradaDate.getTime()) / 60000);
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas}h ${mins}min`;
    };

    const buscarVaga = (vagaId: number): Vaga | undefined => {
        return vagas.find((v) => v.id === vagaId);
    };

    const handleEntradaSuccess = (): void => {
        setShowModalEntrada(false);
        carregarDados();
    };

    const handleSaidaSuccess = (): void => {
        setShowModalSaida(false);
        carregarDados();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Botões de Ação */}
            <div className="grid md:grid-cols-2 gap-4">
                <button
                    onClick={() => setShowModalEntrada(true)}
                    className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg flex items-center justify-center gap-3 font-bold text-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
                >
                    <LogIn size={28} />
                    Registrar Entrada
                </button>

                <button
                    onClick={() => setShowModalSaida(true)}
                    className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg flex items-center justify-center gap-3 font-bold text-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
                >
                    <LogOut size={28} />
                    Registrar Saída
                </button>
            </div>

            {/* Tabela de Veículos no Pátio */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Veículos no Pátio ({movimentacoes.length})
                    </h2>
                    <button
                        onClick={carregarDados}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                        title="Atualizar"
                    >
                        <RefreshCw size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-700">Placa</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Vaga</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Tipo</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Entrada</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Tempo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimentacoes.map((mov) => {
                                const vaga = buscarVaga(mov.vaga_id);
                                const entrada = new Date(mov.entrada);

                                return (
                                    <tr
                                        key={mov.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-4 font-mono font-bold text-gray-800">
                                            {mov.placa}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {vaga?.numero || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 capitalize">
                                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                                {mov.tipo_veiculo}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {entrada.toLocaleString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {calcularTempo(mov.entrada)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {movimentacoes.length === 0 && (
                        <div className="text-center py-12">
                            <Car size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">Nenhum veículo no pátio</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Resumo */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total de veiculos no Pátio</h3>
                    <p className="text-3xl font-bold text-blue-600">{movimentacoes.length}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Carros</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {movimentacoes.filter((m) => m.tipo_veiculo === 'carro').length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Motos</h3>
                    <p className="text-3xl font-bold text-purple-600">
                        {movimentacoes.filter((m) => m.tipo_veiculo === 'moto').length}
                    </p>
                </div>
            </div>

            {/* Modais */}
            {showModalEntrada && (
                <ModalEntrada
                    onClose={() => setShowModalEntrada(false)}
                    onSuccess={handleEntradaSuccess}
                />
            )}

            {showModalSaida && (
                <ModalSaida
                    onClose={() => setShowModalSaida(false)}
                    onSuccess={handleSaidaSuccess}
                />
            )}
        </div>
    );
};

export default Movimentacoes;