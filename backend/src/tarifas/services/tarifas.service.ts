import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa, TipoVeiculo } from '../entities/tarifas.entity';
import { UpdateTarifaDto } from '../dtos/update-tarifas.dto';


@Injectable()
export class TarifasService {
    constructor(
        @InjectRepository(Tarifa)
        private tarifasRepository: Repository<Tarifa>,
    ) { }

    async onModuleInit() {
        // Criar tarifas padrão se não existirem
        await this.criarTarifasPadrao();
    }

    private async criarTarifasPadrao() {
        const tarifaCarro = await this.tarifasRepository.findOne({
            where: { tipo_veiculo: TipoVeiculo.CARRO },
        });

        if (!tarifaCarro) {
            await this.tarifasRepository.save({
                tipo_veiculo: TipoVeiculo.CARRO,
                valor_primeira_hora: 10.0,
                valor_hora_adicional: 5.0,
                tolerancia_minutos: 15,
            });
        }

        const tarifaMoto = await this.tarifasRepository.findOne({
            where: { tipo_veiculo: TipoVeiculo.MOTO },
        });

        if (!tarifaMoto) {
            await this.tarifasRepository.save({
                tipo_veiculo: TipoVeiculo.MOTO,
                valor_primeira_hora: 5.0,
                valor_hora_adicional: 2.5,
                tolerancia_minutos: 15,
            });
        }
    }

    async findAll(): Promise<Tarifa[]> {
        return await this.tarifasRepository.find();
    }

    async findOne(id: string): Promise<Tarifa> {
        const tarifa = await this.tarifasRepository.findOne({ where: { id } });

        if (!tarifa) {
            throw new NotFoundException('Tarifa não encontrada');
        }

        return tarifa;
    }

    async findByTipoVeiculo(tipo: TipoVeiculo): Promise<Tarifa> {
        const tarifa = await this.tarifasRepository.findOne({
            where: { tipo_veiculo: tipo },
        });

        if (!tarifa) {
            throw new NotFoundException(`Tarifa para ${tipo} não encontrada`);
        }

        return tarifa;
    }

    async update(id: string, updateTarifaDto: UpdateTarifaDto): Promise<Tarifa> {
        const tarifa = await this.findOne(id);
        Object.assign(tarifa, updateTarifaDto);
        return await this.tarifasRepository.save(tarifa);
    }

    calcularValor(
        entrada: Date,
        saida: Date,
        tarifa: Tarifa,
    ): number {
        const diferencaMs = saida.getTime() - entrada.getTime();
        const minutosTotais = Math.floor(diferencaMs / 60000);

        // Aplicar tolerância
        if (minutosTotais <= tarifa.tolerancia_minutos) {
            return 0;
        }

        const horas = minutosTotais / 60;

        // Se ficou menos de 1 hora (após tolerância)
        if (horas <= 1) {
            return Number(tarifa.valor_primeira_hora);
        }

        // Calcular horas adicionais (arredondar para cima)
        let horasAdicionais = Math.floor(horas);
        if (minutosTotais % 60 > 0) {
            horasAdicionais += 1;
        }
        horasAdicionais -= 1; // Primeira hora já cobrada

        const valor =
            Number(tarifa.valor_primeira_hora) +
            Number(tarifa.valor_hora_adicional) * horasAdicionais;

        return Math.round(valor * 100) / 100; // 2 casas decimais
    }
}