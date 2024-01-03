import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    private pokemonService: PokemonService
  ){}

  async execute() {
    await this.pokemonService.removeAll();

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

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
