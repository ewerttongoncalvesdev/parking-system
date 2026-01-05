import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { TarifasAPI, vagasAPI } from '../services/api1';
import ModalVaga from './modals/ModalVaga';

// Tipos
type StatusVaga = 'livre' | 'ocupada' | 'manutencao';
type TipoVaga = 'carro' | 'moto' | 'deficiente';
type TipoVeiculo = 'carro' | 'moto';

interface Vaga {
    id: number;
    numero: string;
    tipo: TipoVaga;
    status: StatusVaga;
    created_at: string;
}

interface Tarifa {
    id: number;
    tipo_veiculo: TipoVeiculo;
    valor_primeira_hora: string | number;
    valor_hora_adicional: string | number;
    tolerancia_minutos: number;
}

const Gestao: React.FC = () => {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showModalVaga, setShowModalVaga] = useState<boolean>(false);
    const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async (): Promise<void> => {
        try {
            const [vagasRes, tarifasRes] = await Promise.all([
                vagasAPI.listar(),
                TarifasAPI.listar(),
            ]);
            setVagas(vagasRes.data);
            setTarifas(tarifasRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExcluir = async (id: number): Promise<void> => {
        if (!window.confirm('Deseja realmente excluir esta vaga?')) return;

        try {
            await vagasAPI.excluir(id);
            carregarDados();
        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                'Erro ao excluir vaga. Verifique se não está ocupada.',
            );
        }
    };

    const handleEditar = (vaga: Vaga): void => {
        setEditingVaga(vaga);
        setShowModalVaga(true);
    };

    const handleNovaVaga = (): void => {
        setEditingVaga(null);
        setShowModalVaga(true);
    };

    const handleVagaSuccess = (): void => {
        setShowModalVaga(false);
        setEditingVaga(null);
        carregarDados();
    };

    const getCorStatus = (status: StatusVaga): string => {
        switch (status) {
            case 'livre':
                return 'bg-green-100 text-green-800';
            case 'ocupada':
                return 'bg-red-100 text-red-800';
            case 'manutencao':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
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
            {/* Gestão de Vagas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Gestão de Vagas</h2>
                    <button
                        onClick={handleNovaVaga}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition"
                    >
                        <Plus size={20} />
                        Nova Vaga
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-700">Número</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Tipo</th>
                                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left p-4 font-semibold text-gray-700">
                                    Criada em
                                </th>
                                <th className="text-left p-4 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vagas.map((vaga) => (
                                <tr key={vaga.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-800">{vaga.numero}</td>
                                    <td className="p-4 capitalize">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {vaga.tipo}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getCorStatus(
                                                vaga.status,
                                            )}`}
                                        >
                                            {vaga.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditar(vaga)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleExcluir(vaga.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {vagas.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nenhuma vaga cadastrada</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Gestão de Tarifas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 bg-gray-50 border-b flex items-center gap-2">
                    <DollarSign size={24} className="text-yellow-600" />
                    <h2 className="text-xl font-bold text-gray-800">Tarifas</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                    {tarifas.map((tarifa) => (
                        <div
                            key={tarifa.id}
                            className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-gray-800 capitalize">
                                    {tarifa.tipo_veiculo === 'carro' ? '🚗 Carro' : '🏍️ Moto'}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-600">Primeira Hora:</span>
                                    <span className="font-bold text-green-600 text-lg">
                                        R$ {parseFloat(String(tarifa.valor_primeira_hora)).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-600">Hora Adicional:</span>
                                    <span className="font-bold text-blue-600 text-lg">
                                        R$ {parseFloat(String(tarifa.valor_hora_adicional)).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-600">Tolerância:</span>
                                    <span className="font-bold text-gray-800">
                                        {tarifa.tolerancia_minutos} minutos
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-xs text-yellow-800">
                                    <strong>Exemplo:</strong> 2h30min = R${' '}
                                    {(
                                        parseFloat(String(tarifa.valor_primeira_hora)) +
                                        parseFloat(String(tarifa.valor_hora_adicional)) * 2
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-blue-50 border-t border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                        💡 <strong>Dica:</strong> Os primeiros{' '}
                        {tarifas[0]?.tolerancia_minutos || 15} minutos são gratuitos (tolerância)
                    </p>
                </div>
            </div>

            {/* Resumo Geral */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                        Total de Vagas
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">{vagas.length}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Vagas de Carro</h3>
                    <p className="text-3xl font-bold text-green-600">
                        {vagas.filter((v) => v.tipo === 'carro').length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Vagas de Moto</h3>
                    <p className="text-3xl font-bold text-purple-600">
                        {vagas.filter((v) => v.tipo === 'moto').length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Deficientes</h3>
                    <p className="text-3xl font-bold text-orange-600">
                        {vagas.filter((v) => v.tipo === 'deficiente').length}
                    </p>
                </div>
            </div>

            {/* Modal */}
            {showModalVaga && (
                <ModalVaga
                    vaga={editingVaga}
                    onClose={() => {
                        setShowModalVaga(false);
                        setEditingVaga(null);
                    }}
                    onSuccess={handleVagaSuccess}
                />
            )}
        </div>
    );
};

export default Gestao;