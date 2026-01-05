import {Controller, Get, Post, Body, Param, Delete, Put, Query} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VagasService } from '../services/vagas.service';
import { CreateVagaDto } from '../dtos/create-vaga.dto';
import { StatusVaga, TipoVaga } from '../entities/vagas.entity';
import { UpdateVagaDto } from '../dtos/update-vaga.dto';


@ApiTags('vagas')
@Controller('vagas')
export class VagasController {
    constructor(private readonly vagasService: VagasService) { }

    @Post()
    @ApiOperation({ summary: 'Criar nova vaga' })
    create(@Body() createVagaDto: CreateVagaDto) {
        return this.vagasService.create(createVagaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar vagas com filtros' })
    @ApiQuery({ name: 'status', enum: StatusVaga, required: false })
    @ApiQuery({ name: 'tipo', enum: TipoVaga, required: false })
    findAll(
        @Query('status') status?: StatusVaga,
        @Query('tipo') tipo?: TipoVaga,
    ) {
        return this.vagasService.findAll(status, tipo);
    }

    @Get('estatisticas')
    @ApiOperation({ summary: 'Obter estatísticas das vagas' })
    getEstatisticas() {
        return this.vagasService.getEstatisticas();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar vaga por ID' })
    findOne(@Param('id') id: string) {
        return this.vagasService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar vaga' })
    update(@Param('id') id: string, @Body() updateVagaDto: UpdateVagaDto) {
        return this.vagasService.update(id, updateVagaDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir vaga' })
    remove(@Param('id') id: string) {
        return this.vagasService.remove(id);
    }
}