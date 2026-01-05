import axios, { type AxiosInstance, type AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

type Params = Record<string, string | number | boolean>;
type Data = Record<string, unknown>;

// Vagas
export const VagasAPI = {
    listar: (params?: Params): Promise<AxiosResponse> =>
        api.get('/vagas', params),

    crair: (data: Data): Promise<AxiosResponse> =>
        api.post('/vagas', data),

    atualizar: (id: number | string, data: Data): Promise<AxiosResponse> =>
        api.put(`/vagas/${id}`, data),

    excluir: (id: number | string): Promise<AxiosResponse> =>
        api.delete(`/vagas/${id}`),

    buscarPorId: (id: number | string): Promise<AxiosResponse> =>
        api.get(`/vagas/${id}`),

    estatisticas: (): Promise<AxiosResponse> =>
        api.get('vagas/estatisticas'),
}

// Movimentações
export const MovimentacoesAPI = {
    registrarEntrada: (data: Data): Promise<AxiosResponse> =>
        api.post('movimentacoes/entrada', data),

    registrarSaida: (data: Data): Promise<AxiosResponse> =>
        api.post('movimentacoes/saida', data),

    listarAtivas: (): Promise<AxiosResponse> =>
        api.get('/movimentacoes'),

    historico: (params?: Params): Promise<AxiosResponse> =>
        api.get('/movimentacoes/historico', {params}),

};

// Tarifas
export const TarifasAPI = {
    listar:(): Promise<AxiosResponse> =>
        api.get('/tarifas'),

    atualizar:(id: number | string, data: Data): Promise<AxiosResponse> =>
        api.put(`/tarifas/${id}`, data),

    buscarPorId: (id: number | string): Promise<AxiosResponse> =>
        api.get(`/tarifas/${id}`),
};

export default api