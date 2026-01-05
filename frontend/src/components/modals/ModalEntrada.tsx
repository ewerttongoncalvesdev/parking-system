import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MovimentacoesAPI, vagasAPI } from '../../services/api1';

interface ModalEntradaProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    placa: string;
    vaga_id: string;
    tipo_veiculo: 'carro' | 'moto';
}

interface Vaga {
    id: string;
    numero: string;
    tipo: string;
}

const ModalEntrada = ({ onClose, onSuccess }: ModalEntradaProps) => {
    const [formData, setFormData] = useState<FormData>({
        placa: '',
        vaga_id: '',
        tipo_veiculo: 'carro',
    });

    const [vagasLivres, setVagasLivres] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        carregarVagasLivres();
    }, []);

    const carregarVagasLivres = async () => {
        try {
            const response = await vagasAPI.listar({ status: 'livre' });
            setVagasLivres(response.data);
        } catch (error) {
            console.error('Erro ao carregar vagas:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await MovimentacoesAPI.registrarEntrada({
                ...formData,
                placa: formData.placa.toUpperCase(),
            });
            onSuccess();
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Erro ao registrar entrada. Verifique os dados.',
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
                        Registrar Entrada
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* PLACA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Placa do Veículo *
                            </label>
                            <input
                                type="text"
                                value={formData.placa}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        placa: e.target.value.toUpperCase(),
                                    })
                                }
                                placeholder="ABC-1234 ou ABC1D23"
                                maxLength={8}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Formatos aceitos: ABC-1234 ou ABC1D23
                            </p>
                        </div>

                        {/* VAGA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vaga *
                            </label>
                            <select
                                value={formData.vaga_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, vaga_id: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Selecione uma vaga</option>
                                {vagasLivres.map((vaga) => (
                                    <option key={vaga.id} value={vaga.id}>
                                        {vaga.numero} - {vaga.tipo}
                                    </option>
                                ))}
                            </select>

                            {vagasLivres.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                    Nenhuma vaga livre disponível
                                </p>
                            )}
                        </div>

                        {/* TIPO VEÍCULO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Veículo *
                            </label>
                            <select
                                value={formData.tipo_veiculo}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tipo_veiculo: e.target.value as 'carro' | 'moto',
                                    })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="carro">Carro</option>
                                <option value="moto">Moto</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.placa || !formData.vaga_id}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition"
                    >
                        {loading ? 'Registrando...' : 'Registrar Entrada'}
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEntrada;
