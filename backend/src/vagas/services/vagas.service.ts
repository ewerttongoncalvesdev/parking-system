import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusVaga, Vaga } from '../entities/vagas.entity';

@Injectable()
export class VagasService {
    constructor(
        @InjectRepository(Vaga)
        private vagasRepository: Repository<Vaga>,
        @Inject(forwardRef(() => 'MovimentacoesService'))
        private movimentacoesService: any,
    ) { }

    async getEstatisticas() {
        const total = await this.vagasRepository.count();
        const ocupadas = await this.vagasRepository.count({
            where: { status: StatusVaga.OCUPADA },
        });
        const livres = await this.vagasRepository.count({
            where: { status: StatusVaga.LIVRE },
        });
        const manutencao = await this.vagasRepository.count({
            where: { status: StatusVaga.MANUTENCAO },
        });

        const percentualOcupacao = total > 0 ? (ocupadas / total) * 100 : 0;

        // Buscar receita do dia
        const receitaDia = await this.movimentacoesService.getReceitaDia();

        return {
            total,
            ocupadas,
            livres,
            manutencao,
            percentual_ocupacao: Math.round(percentualOcupacao * 100) / 100,
            receita_dia: receitaDia,
        };
    }
}