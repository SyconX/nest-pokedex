import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginatorDto } from '../common/dto/paginator.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); 
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createMany(createPokemonDto: CreatePokemonDto[]) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); 
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll( paginatorDto: PaginatorDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginatorDto;
    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 'asc'
      })
      .select('-__v'); // Quita columna con -
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    // número
    if ( !isNaN(+term)) 
    pokemon = await this.pokemonModel.findOne({no : term});
    // mongoID
    if ( !pokemon && isValidObjectId(term) ) 
    pokemon = await this.pokemonModel.findById(term);
    // nombre  
    if ( !pokemon ) 
      pokemon = await this.pokemonModel.findOne({name : term.toLowerCase().trim()});
    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon no encontrado`)
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  
  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // try {
    //   await pokemon.deleteOne();
    //   return {id};
    // } catch (error) {
    //   this.handleExceptions(error);
    // }

    // Se comprueba con el pipe si es un mongoID, por lo que siempre llega mongoID
    // Ventaja frente al anterior código porque realiza solo 1 consulta a DB
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon con id ${id} no encontrado`)
    return;
  }

  async removeAll() {
    const { deletedCount } = await this.pokemonModel.deleteMany({});
    if (deletedCount === 0)
      throw new BadRequestException(`No se han podido borrar los pokemons`)
    return;
  } 

  private handleExceptions(error: any) {
    if (error.code === 11000) 
      throw new BadRequestException(`Pokemon ya existe en DB ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException(`No se pudo actualizar el pokemon: ${error}`);

  }
}
