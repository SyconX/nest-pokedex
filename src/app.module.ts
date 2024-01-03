import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    // permite servir en la raíz el contenido de public (index.html)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // config mongoose para trabajar con mongoDB
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    
    PokemonModule,
    
    CommonModule,
    
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
