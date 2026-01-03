import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VagasModule } from '../vagas/vagas.module';
import { TarifasModule } from '../tarifas/tarifas.module';
import { Movimentacao } from './entities/movimentacoes.entity';
import { MovimentacoesController } from './controllers/movimentacoes.controller';
import { MovimentacoesService } from './services/movimentacoes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movimentacao]),
        VagasModule,
        TarifasModule,
    ],
    controllers: [MovimentacoesController],
    providers: [MovimentacoesService],
})
export class MovimentacoesModule { }