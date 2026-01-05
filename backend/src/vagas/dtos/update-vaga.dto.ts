import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusVaga, TipoVaga } from '../entities/vagas.entity';


export class UpdateVagaDto {
    @ApiProperty({ example: 'A1', required: false })
    @IsString()
    @IsOptional()
    numero?: string;

    @ApiProperty({ enum: StatusVaga, required: false })
    @IsEnum(StatusVaga)
    @IsOptional()
    status?: StatusVaga;

    @ApiProperty({ enum: TipoVaga, required: false })
    @IsEnum(TipoVaga)
    @IsOptional()
    tipo?: TipoVaga;
}