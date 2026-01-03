import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaidaDto {
    @ApiProperty({ example: 'ABC-1234' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, {
        message: 'Formato de placa inválido. Use ABC-1234 ou ABC1D23',
    })
    placa: string;
}