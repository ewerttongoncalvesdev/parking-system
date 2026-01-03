import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusVagas, TipoVaga } from '../entities/vagas.entity';


export class UpdateVagaDto {
    @ApiProperty({ example: 'A1', required: false })
    @IsString()
    @IsOptional()
    numero?: string;

    @ApiProperty({ enum: StatusVagas, required: false })
    @IsEnum(StatusVagas)
    @IsOptional()
    status?: StatusVagas;

    @ApiProperty({ enum: TipoVaga, required: false })
    @IsEnum(TipoVaga)
    @IsOptional()
    tipo?: TipoVaga;
}