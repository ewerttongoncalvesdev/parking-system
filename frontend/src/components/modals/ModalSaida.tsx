import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { MovimentacoesAPI } from '../../services/api1';

interface ModalSaidaProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface ResultadoSaida {
    placa: string;
    entrada: string;
    saida: string;
    valor_pago: string | number;
}

const ModalSaida = ({ onClose, onSuccess }: ModalSaidaProps) => {
    const [placa, setPlaca] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [resultado, setResultado] = useState<ResultadoSaida | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResultado(null);

        try {
            const response = await MovimentacoesAPI.registrarSaida({
                placa: placa.toUpperCase(),
            });
            setResultado(response.data);
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                'Erro ao registrar saída. Verifique a placa.',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmar = () => {
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        Registrar Saída
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

                    {!resultado ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Placa do Veículo *
                                </label>
                                <input
                                    type="text"
                                    value={placa}
                                    onChange={(e) =>
                                        setPlaca(e.target.value.toUpperCase())
                                    }
                                    placeholder="ABC-1234 ou ABC1D23"
                                    maxLength={8}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <DollarSign className="text-green-600" size={24} />
                                    <h4 className="font-bold text-green-800">
                                        Saída Registrada!
                                    </h4>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Placa:</span>
                                        <span className="font-mono font-bold">
                                            {resultado.placa}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Entrada:</span>
                                        <span>
                                            {new Date(resultado.entrada).toLocaleString('pt-BR')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Saída:</span>
                                        <span>
                                            {new Date(resultado.saida).toLocaleString('pt-BR')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-green-300">
                                        <span className="text-gray-800 font-bold">
                                            Valor a Pagar:
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                            R$ {Number(resultado.valor_pago).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t bg-gray-50">
                    {!resultado ? (
                        <>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !placa}
                                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition"
                            >
                                {loading ? 'Calculando...' : 'Calcular e Confirmar'}
                            </button>

                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleConfirmar}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition"
                        >
                            Fechar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalSaida;
