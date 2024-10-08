import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';


import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService:ConfigService,
  ){
    this.defaultLimit = configService.get('defaultLimit');
  }




  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try{
    const pokemon = await this.pokemonModel.create(createPokemonDto)
    return pokemon;
  }catch(error){
    this.handleException(error)
  }
  }

  findAll(paginationDto: PaginationDto) {
    
    const {limit = this.defaultLimit, offset = 0} = paginationDto;

    return this.pokemonModel.find()
    .skip(offset)
    .limit(limit)
    .sort({
      no:1
    })
    .select('-__v');
  }

  async findOne(id: string) {
    
    let pokemon: Pokemon;
    if(!isNaN(+id)){
      pokemon = await this.pokemonModel.findOne({no:id});
    }

    //MONGO ID
    if(isValidObjectId(id)){
      pokemon = await this.pokemonModel.findById(id);
    }

    //NAME
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: id.toLowerCase().trim()})
    }



    if(!pokemon) 
      throw new NotFoundException('Pokemon not found');


    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(id);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try{
      await pokemon.updateOne(updatePokemonDto, {new: true});    
      return {...pokemon.toJSON(), ...updatePokemonDto};
  } catch(error){
    this.handleException(error)
  }
  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id '${id}' not found`);
    return;
  }


  private handleException(error:any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exixst in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`CANT'T CREATE POKEMON - CHECK LOGS`)
  }
}
