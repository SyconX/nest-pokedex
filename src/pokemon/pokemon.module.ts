import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      { 
        name: Pokemon.name, // No es la propiedad name, es una propiedad concreta al extender de Document
        schema: PokemonSchema 
      }
    ]),
    ConfigModule
  ],
  exports: [PokemonService]
})
export class PokemonModule {}
