import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vaga, StatusVaga, TipoVaga } from '../entities/vagas.entity';
import { CreateVagaDto } from '../dtos/create-vaga.dto';
import { UpdateVagaDto } from '../dtos/update-vaga.dto';
import { Movimentacao } from '../../movimentacoes/entities/movimentacoes.entity';

@Injectable()
export class VagasService {
    constructor(
        @InjectRepository(Vaga)
        private readonly vagaRepository: Repository<Vaga>,

        @InjectRepository(Movimentacao)
        private readonly movimentacaoRepository: Repository<Movimentacao>,
    ) { }

    // Criar vaga
    async create(createVagaDto: CreateVagaDto): Promise<Vaga> {
        const vaga = this.vagaRepository.create(createVagaDto);
        return this.vagaRepository.save(vaga);
    }

    // Listar vagas com filtros
    async findAll(
        status?: StatusVaga,
        tipo?: TipoVaga,
    ): Promise<Vaga[]> {
        const query = this.vagaRepository.createQueryBuilder('vaga');

        if (status) {
            query.andWhere('vaga.status = :status', { status });
        }

        if (tipo) {
            query.andWhere('vaga.tipo = :tipo', { tipo });
        }

        return query.getMany();
    }

    // Buscar vaga por ID
    async findOne(id: string): Promise<Vaga> {
        const vaga = await this.vagaRepository.findOne({ where: { id } });

        if (!vaga) {
            throw new NotFoundException('Vaga não encontrada');
        }

        return vaga;
    }

    // Atualizar vaga
    async update(
        id: string,
        updateVagaDto: UpdateVagaDto,
    ): Promise<Vaga> {
        const vaga = await this.findOne(id);

        Object.assign(vaga, updateVagaDto);
        return this.vagaRepository.save(vaga);
    }

    // Remover vaga
    async remove(id: string): Promise<void> {
        const vaga = await this.findOne(id);
        await this.vagaRepository.remove(vaga);
    }

    // Estatísticas para o Dashboard
    async getEstatisticas() {
        // 1. Contagens de Vagas
        const total = await this.vagaRepository.count();

        const livres = await this.vagaRepository.count({
            where: { status: StatusVaga.LIVRE },
        });

        const ocupadas = await this.vagaRepository.count({
            where: { status: StatusVaga.OCUPADA },
        });

        // 2. Cálculo da Receita Total (Soma de todas as movimentações sem filtro de data)
        const todasMovimentacoes = await this.movimentacaoRepository.find();
        
        
        const receita_dia = todasMovimentacoes.reduce((acumulado, mov) => {
            return acumulado + Number(mov.valor_pago || 0);
        }, 0);

        // 3. Cálculo de percentual para a barra de progresso
        const percentual_ocupacao = total > 0 ? (ocupadas / total) * 100 : 0;

        return {
            total,
            livres,
            ocupadas,
            receita_dia, 
            percentual_ocupacao,
        };
    }
}