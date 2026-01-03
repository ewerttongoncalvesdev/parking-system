import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusVagas, TipoVaga, Vaga } from '../entities/vagas.entity';
import { CreateVagaDto } from '../dtos/create-vaga.dto';
import { UpdateVagaDto } from '../dtos/update-vaga.dto';

@Injectable()
export class VagasService {
    constructor(
        @InjectRepository(Vaga)
        private vagasRepository: Repository<Vaga>,
    ) { }

    async create(createVagaDto: CreateVagaDto): Promise<Vaga> {
        // Verificar se número já existe
        const existente = await this.vagasRepository.findOne({
            where: { numero: createVagaDto.numero },
        });

        if (existente) {
            throw new ConflictException('Número de vaga já existe');
        }

        const vaga = this.vagasRepository.create(createVagaDto);
        return await this.vagasRepository.save(vaga);
    }

    async findAll(status?: StatusVagas, tipo?: TipoVaga): Promise<Vaga[]> {
        const query = this.vagasRepository.createQueryBuilder('vaga');

        if (status) {
            query.andWhere('vaga.status = :status', { status });
        }

        if (tipo) {
            query.andWhere('vaga.tipo = :tipo', { tipo });
        }

        return await query.getMany();
    }

    async findOne(id: string): Promise<Vaga> {
        const vaga = await this.vagasRepository.findOne({ where: { id } });

        if (!vaga) {
            throw new NotFoundException('Vaga não encontrada');
        }

        return vaga;
    }

    async update(id: string, updateVagaDto: UpdateVagaDto): Promise<Vaga> {
        const vaga = await this.findOne(id);

        // Verificar número duplicado
        if (updateVagaDto.numero && updateVagaDto.numero !== vaga.numero) {
            const existente = await this.vagasRepository.findOne({
                where: { numero: updateVagaDto.numero },
            });

            if (existente) {
                throw new ConflictException('Número de vaga já existe');
            }
        }

        Object.assign(vaga, updateVagaDto);
        return await this.vagasRepository.save(vaga);
    }

    async remove(id: string): Promise<void> {
        const vaga = await this.findOne(id);

        if (vaga.status === StatusVagas.OCUPADA) {
            throw new BadRequestException('Não é possível excluir vaga ocupada');
        }

        await this.vagasRepository.remove(vaga);
    }

    async getEstatisticas() {
        const total = await this.vagasRepository.count();
        const ocupadas = await this.vagasRepository.count({
            where: { status: StatusVagas.OCUPADA },
        });
        const livres = await this.vagasRepository.count({
            where: { status: StatusVagas.LIVRE },
        });
        const manutencao = await this.vagasRepository.count({
            where: { status: StatusVagas.MANUTENCAO },
        });

        const percentualOcupacao = total > 0 ? (ocupadas / total) * 100 : 0;

        return {
            total,
            ocupadas,
            livres,
            manutencao,
            percentual_ocupacao: Math.round(percentualOcupacao * 100) / 100,
        };
    }
}