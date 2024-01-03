import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}
  
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); 
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.pokemonModel.find();
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


  private handleExceptions(error: any) {
    if (error.code === 11000) 
      throw new BadRequestException(`Pokemon ya existe en DB ${JSON.stringify(error.keyValue)}`);
    console.log(error);
    throw new InternalServerErrorException(`No se pudo actualizar el pokemon: ${error}`);

  }
}
