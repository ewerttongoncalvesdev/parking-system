import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MovimentacoesService } from '../services/movimentacoes.service';
import { EntradaDto } from '../dtos/entrada.dto';
import { SaidaDto } from '../dtos/saida.dto';

@ApiTags('movimentacoes')
@Controller('movimentacoes')
export class MovimentacoesController {
    constructor(private readonly movimentacoesService: MovimentacoesService) { }

    @Post('entrada')
    @ApiOperation({ summary: 'Registrar entrada de veículo' })
    registrarEntrada(@Body() entradaDto: EntradaDto) {
        return this.movimentacoesService.registrarEntrada(entradaDto);
    }

    @Post('saida')
    @ApiOperation({ summary: 'Registrar saída de veículo e calcular valor' })
    registrarSaida(@Body() saidaDto: SaidaDto) {
        return this.movimentacoesService.registrarSaida(saidaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar movimentações ativas (veículos no pátio)' })
    findAtivas() {
        return this.movimentacoesService.findAtivas();
    }

    @Get('historico')
    @ApiOperation({ summary: 'Histórico de movimentações' })
    @ApiQuery({ name: 'data_inicio', required: false })
    @ApiQuery({ name: 'data_fim', required: false })
    findHistorico(
        @Query('data_inicio') dataInicio?: string,
        @Query('data_fim') dataFim?: string,
    ) {
        return this.movimentacoesService.findHistorico(dataInicio, dataFim);
    }
}
