import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vaga } from './entities/vagas.entity';
import { VagasController } from './controllers/vagas.controller';
import { VagasService } from './services/vagas.service';

@Module({
    imports: [TypeOrmModule.forFeature([Vaga])],
    controllers: [VagasController],
    providers: [VagasService],
    exports: [VagasService],
})
export class VagasModule { }