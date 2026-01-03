import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoVaga } from '../entities/vagas.entity';

export class CreateVagaDto {
    @ApiProperty({ example: 'A1' })
    @IsString()
    @IsNotEmpty()
    numero: string;

    @ApiProperty({ enum: TipoVaga, example: TipoVaga.CARRO })
    @IsEnum(TipoVaga)
    @IsNotEmpty()
    tipo: TipoVaga;
}