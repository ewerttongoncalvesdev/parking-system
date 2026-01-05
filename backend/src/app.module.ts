import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VagasModule } from './vagas/vagas.module';
import { MovimentacoesModule } from './movimentacoes/movimentacoes.module';
import { TarifasModule } from './tarifas/tarifas.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<number>('DB_PORT')) || 5432,
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'parking_db'),
        autoLoadEntities: true,
        synchronize: true, // usar apenas em desenvolvimento
        logging: true,
      }),
    }),

    VagasModule,
    MovimentacoesModule,
    TarifasModule,
  ],
})
export class AppModule { }
