import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoVeiculo {
    CARRO = 'carro',
    MOTO = 'moto',
}

@Entity('tarifas')
export class Tarifa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TipoVeiculo,
        unique: true,
    })
    tipo_veiculo: TipoVeiculo;

    @Column('decimal', { precision: 10, scale: 2 })
    valor_primeira_hora: number;

    @Column('decimal', { precision: 10, scale: 2 })
    valor_hora_adicional: number;

    @Column({ default: 15 })
    tolerancia_minutos: number;
}