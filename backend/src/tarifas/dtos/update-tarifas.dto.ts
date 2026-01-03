import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTarifaDto {
    @ApiProperty({ example: 10.0, required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    valor_primeira_hora?: number;

    @ApiProperty({ example: 5.0, required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    valor_hora_adicional?: number;

    @ApiProperty({ example: 15, required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    tolerancia_minutos?: number;
}