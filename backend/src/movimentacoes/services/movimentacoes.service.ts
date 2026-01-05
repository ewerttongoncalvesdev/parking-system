import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { Movimentacao } from '../entities/movimentacoes.entity';
import { VagasService } from '../../vagas/services/vagas.service';
import { TarifasService } from '../../tarifas/services/tarifas.service';
import { EntradaDto } from '../dtos/entrada.dto';
import { SaidaDto } from '../dtos/saida.dto';
import { StatusVaga, TipoVaga } from '../../vagas/entities/vagas.entity';

@Injectable()
export class MovimentacoesService {
  constructor(
    @InjectRepository(Movimentacao)
    private readonly movimentacoesRepository: Repository<Movimentacao>,
    private readonly vagasService: VagasService,
    private readonly tarifasService: TarifasService,
  ) {}

  async registrarEntrada(entradaDto: EntradaDto): Promise<Movimentacao> {
    // Buscar vaga
    const vaga = await this.vagasService.findOne(entradaDto.vaga_id);

    if (!vaga) {
      throw new NotFoundException('Vaga não encontrada');
    }

    // Verificar status da vaga
    if (vaga.status !== StatusVaga.LIVRE) {
      throw new BadRequestException(
        `Vaga não está livre (status atual: ${vaga.status})`,
      );
    }

    // Validar compatibilidade veículo/vaga
    if (
      entradaDto.tipo_veiculo === 'carro' &&
      vaga.tipo === TipoVaga.MOTO
    ) {
      throw new BadRequestException('Carro não pode ocupar vaga de moto');
    }

    // Criar movimentação
    const movimentacao = this.movimentacoesRepository.create({
      ...entradaDto,
      placa: entradaDto.placa.trim().toUpperCase(),
      vaga,
    });

    await this.movimentacoesRepository.save(movimentacao);

    // Atualizar status da vaga
    await this.vagasService.update(vaga.id, {
      status: StatusVaga.OCUPADA,
    });

    return movimentacao;
  }

  async registrarSaida(saidaDto: SaidaDto): Promise<Movimentacao> {
    const placaUpper = saidaDto.placa.trim().toUpperCase();

    // Buscar movimentação ativa
    const movimentacao = await this.movimentacoesRepository.findOne({
      where: {
        placa: placaUpper,
        saida: IsNull(),
      },
      relations: ['vaga'],
    });

    if (!movimentacao) {
      throw new NotFoundException('Veículo não encontrado no pátio');
    }

    const agora = new Date();
    movimentacao.saida = agora;

    // Buscar tarifa
    const tarifa = await this.tarifasService.findByTipoVeiculo(
      movimentacao.tipo_veiculo,
    );

    // Calcular valor
    movimentacao.valor_pago = this.tarifasService.calcularValor(
      movimentacao.entrada,
      agora,
      tarifa,
    );

    await this.movimentacoesRepository.save(movimentacao);

    // Liberar vaga
    await this.vagasService.update(movimentacao.vaga.id, {
      status: StatusVaga.LIVRE,
    });

    return movimentacao;
  }

  async findAtivas(): Promise<Movimentacao[]> {
    return this.movimentacoesRepository.find({
      where: { saida: IsNull() },
      relations: ['vaga'],
      order: { entrada: 'DESC' },
    });
  }

  async findHistorico(
    dataInicio?: string,
    dataFim?: string,
  ): Promise<Movimentacao[]> {
    const query = this.movimentacoesRepository
      .createQueryBuilder('mov')
      .leftJoinAndSelect('mov.vaga', 'vaga')
      .where('mov.saida IS NOT NULL');

    if (dataInicio && dataFim) {
      query.andWhere('mov.saida BETWEEN :inicio AND :fim', {
        inicio: new Date(dataInicio),
        fim: new Date(dataFim),
      });
    }

    return query.orderBy('mov.saida', 'DESC').getMany();
  }

  async getReceitaDia(): Promise<number> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const movimentacoes = await this.movimentacoesRepository.find({
      where: {
        saida: Between(hoje, amanha),
      },
    });

    const receita = movimentacoes.reduce(
      (total, mov) => total + (Number(mov.valor_pago) || 0),
      0,
    );

    return Number(receita.toFixed(2));
  }
}
