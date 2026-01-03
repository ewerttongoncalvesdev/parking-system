import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum StatusVagas {
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
        enum: StatusVagas,
        default: StatusVagas.LIVRE,
    })
    status: StatusVagas;

    @Column({
        type: 'enum',
        enum: TipoVaga,
    })
    tipo: TipoVaga;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}