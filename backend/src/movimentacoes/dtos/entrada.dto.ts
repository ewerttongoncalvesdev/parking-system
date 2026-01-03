import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoVeiculo } from '../entities/movimentacoes.entity';

export class EntradaDto {
    @ApiProperty({ example: 'ABC-1234' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, {
        message: 'Formato de placa inválido. Use ABC-1234 ou ABC1D23',
    })
    placa: string;

    @ApiProperty({ example: 'uuid-da-vaga' })
    @IsUUID()
    @IsNotEmpty()
    vaga_id: string;

    @ApiProperty({ enum: TipoVeiculo, example: TipoVeiculo.CARRO })
    @IsEnum(TipoVeiculo)
    @IsNotEmpty()
    tipo_veiculo: TipoVeiculo;
}