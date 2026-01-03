import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TarifasService } from '../services/tarifas.service';
import { UpdateTarifaDto } from '../dtos/update-tarifas.dto';

@ApiTags('tarifas')
@Controller('tarifas')
export class TarifasController {
    constructor(private readonly tarifasService: TarifasService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas as tarifas' })
    findAll() {
        return this.tarifasService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar tarifa por ID' })
    findOne(@Param('id') id: string) {
        return this.tarifasService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar tarifa' })
    update(@Param('id') id: string, @Body() updateTarifaDto: UpdateTarifaDto) {
        return this.tarifasService.update(id, updateTarifaDto);
    }
}
