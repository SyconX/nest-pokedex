import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    private readonly http: AxiosAdapter,
    private readonly pokemonService: PokemonService
  ){}

  async execute() {
    await this.pokemonService.removeAll();

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    let pokemonsToInsert: CreatePokemonDto[] = [];

    data.results.forEach(({name, url}) => {      
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonsToInsert.push({name, no});
    }) 

    await this.pokemonService.createMany(pokemonsToInsert);

    return 'Seed ejecutada';
  }
}
