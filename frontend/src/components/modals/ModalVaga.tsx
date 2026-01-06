import React, { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { vagasAPI } from '../../services/api1';


/* =========================
   Tipos e Interfaces
========================= */

type TipoVaga = 'carro' | 'moto' | 'deficiente';
type StatusVaga = 'livre' | 'ocupada' | 'manutencao';

interface Vaga {
    id: number;
    numero: string;
    tipo: TipoVaga;
    status: StatusVaga;
}

interface FormData {
    numero: string;
    tipo: TipoVaga;
    status: StatusVaga;
}

interface ModalVagaProps {
    vaga?: Vaga | null;
    onClose: () => void;
    onSuccess: () => void;
}

/* =========================
   Componente
========================= */

const ModalVaga: React.FC<ModalVagaProps> = ({
    vaga,
    onClose,
    onSuccess,
}) => {
    const [formData, setFormData] = useState<FormData>({
        numero: '',
        tipo: 'carro',
        status: 'livre',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (vaga) {
            setFormData({
                numero: vaga.numero,
                tipo: vaga.tipo,
                status: vaga.status,
            });
        }
    }, [vaga]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (vaga) {
               
                await vagasAPI.atualizar(vaga.id, formData);
            } else {
               
                const { status, ...dadosParaCriar } = formData;

                await vagasAPI.criar(dadosParaCriar);
            }
            onSuccess();
        } catch (err: any) {
           
            setError(
                err?.response?.data?.message ||
                'Erro ao salvar vaga. Verifique os dados.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        {vaga ? 'Editar Vaga' : 'Nova Vaga'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {/* Se o erro for um array de mensagens, transformamos em string */}
                            {Array.isArray(error) ? error.join(', ') : error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número da Vaga *
                            </label>
                            <input
                                type="text"
                                value={formData.numero}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        numero: e.target.value.toUpperCase(),
                                    })
                                }
                                placeholder="Ex: A1, B2, C10"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Use letras e números (ex: A1, B2)
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Vaga *
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tipo: e.target.value as TipoVaga,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="carro">🚗 Carro</option>
                                <option value="moto">🏍️ Moto</option>
                                <option value="deficiente">♿ Deficiente</option>
                            </select>
                        </div>

                        {vaga && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value as StatusVaga,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="livre">🟢 Livre</option>
                                    <option value="ocupada">🔴 Ocupada</option>
                                    <option value="manutencao">🔧 Manutenção</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {!vaga && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Dica:</strong> A vaga será criada com status
                                "Livre" por padrão
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6 border-t pt-6">
                        <button
                            type="submit"
                            disabled={loading || !formData.numero}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition shadow-md active:scale-95"
                        >
                            {loading
                                ? 'Salvando...'
                                : vaga
                                    ? 'Atualizar'
                                    : 'Criar Vaga'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalVaga;