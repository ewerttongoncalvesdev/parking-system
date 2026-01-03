import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vaga } from '../../vagas/entities/vagas.entity';

export enum TipoVeiculo {
    CARRO = 'carro',
    MOTO = 'moto',
}

@Entity('movimentacoes')
export class Movimentacao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    vaga_id: string;

    @ManyToOne(() => Vaga, (vaga) => vaga.movimentacoes)
    @JoinColumn({ name: 'vaga_id' })
    vaga: Vaga;

    @Column()
    placa: string;

    @Column({
        type: 'enum',
        enum: TipoVeiculo,
    })
    tipo_veiculo: TipoVeiculo;

    @CreateDateColumn()
    entrada: Date;

    @Column({ type: 'timestamp', nullable: true })
    saida: Date;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    valor_pago: number;
}