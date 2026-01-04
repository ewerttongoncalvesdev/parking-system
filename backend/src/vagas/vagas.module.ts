import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentacoesModule } from '../movimentacoes/movimentacoes.module';
import { Vaga } from './entities/vagas.entity';
import { VagasController } from './controllers/vagas.controller';
import { VagasService } from './services/vagas.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vaga]),
        forwardRef(() => MovimentacoesModule),
    ],
    controllers: [VagasController],
    providers: [VagasService],
    exports: [VagasService],
})
export class VagasModule { }