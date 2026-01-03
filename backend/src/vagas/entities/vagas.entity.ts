import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Movimentacao } from '../../movimentacoes/entities/movimentacoes.entity';

export enum StatusVaga {
  LIVRE = 'livre',
  OCUPADA = 'ocupada',
  MANUTENCAO = 'manutencao',
}

export enum TipoVaga {
  CARRO = 'carro',
  MOTO = 'moto',
  DEFICIENTE = 'deficiente',
}

@Entity('vagas')
export class Vaga {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: StatusVaga,
    default: StatusVaga.LIVRE,
  })
  status: StatusVaga;

  @Column({
    type: 'enum',
    enum: TipoVaga,
  })
  tipo: TipoVaga;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Movimentacao, (movimentacao) => movimentacao.vaga)
  movimentacoes: Movimentacao[];
}