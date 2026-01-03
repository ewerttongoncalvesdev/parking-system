import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarifa } from './entities/tarifas.entity';
import { TarifasController } from './controllers/tarifas.controller';
import { TarifasService } from './services/tarifas.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tarifa])],
    controllers: [TarifasController],
    providers: [TarifasService],
    exports: [TarifasService],
})
export class TarifasModule { }