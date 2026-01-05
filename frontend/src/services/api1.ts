import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

/* =========================
   Configuração base
========================= */

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

/* =========================
   Tipos compartilhados
========================= */

export type TipoVaga = 'carro' | 'moto' | 'deficiente';
export type StatusVaga = 'livre' | 'ocupada' | 'manutencao';

export interface VagaDTO {
    id: number;
    numero: string;
    tipo: TipoVaga;
    status: StatusVaga;
}

export interface CriarVagaDTO {
    numero: string;
    tipo: TipoVaga;
    status?: StatusVaga;
}

export interface AtualizarVagaDTO {
    numero?: string;
    tipo?: TipoVaga;
    status?: StatusVaga;
}

type Params = Record<string, string | number | boolean>;

/* =========================
   Vagas API
========================= */

export const vagasAPI = {
    listar: (params?: Params): Promise<AxiosResponse<VagaDTO[]>> =>
        api.get('/vagas', { params }),

    buscarPorId: (id: number): Promise<AxiosResponse<VagaDTO>> =>
        api.get(`/vagas/${id}`),

    criar: (data: CriarVagaDTO): Promise<AxiosResponse<VagaDTO>> =>
        api.post('/vagas', data),

    atualizar: (
        id: number,
        data: AtualizarVagaDTO,
    ): Promise<AxiosResponse<VagaDTO>> =>
        api.put(`/vagas/${id}`, data),

    excluir: (id: number): Promise<AxiosResponse<void>> =>
        api.delete(`/vagas/${id}`),

    estatisticas: (): Promise<AxiosResponse> =>
        api.get('/vagas/estatisticas'),
};

/* =========================
   Movimentações
========================= */

export const MovimentacoesAPI = {
    registrarEntrada: (data: Record<string, unknown>): Promise<AxiosResponse> =>
        api.post('/movimentacoes/entrada', data),

    registrarSaida: (data: Record<string, unknown>): Promise<AxiosResponse> =>
        api.post('/movimentacoes/saida', data),

    listarAtivas: (): Promise<AxiosResponse> =>
        api.get('/movimentacoes'),

    historico: (params?: Params): Promise<AxiosResponse> =>
        api.get('/movimentacoes/historico', { params }),
};

/* =========================
   Tarifas
========================= */

export const TarifasAPI = {
    listar: (): Promise<AxiosResponse> =>
        api.get('/tarifas'),

    buscarPorId: (id: number): Promise<AxiosResponse> =>
        api.get(`/tarifas/${id}`),

    atualizar: (
        id: number,
        data: Record<string, unknown>,
    ): Promise<AxiosResponse> =>
        api.put(`/tarifas/${id}`, data),
};

export default api;
