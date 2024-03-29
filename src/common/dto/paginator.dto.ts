import { IsPositive, Min, IsOptional, IsInt, IsNumber } from 'class-validator';

export class PaginatorDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit: number;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset: number;
}
