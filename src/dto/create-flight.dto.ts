import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
} from '@nestjs/class-validator';

export class CreateFlightDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly destination: string;

  @IsNotEmpty()
  @IsDate()
  readonly departureTime: Date;

  @IsNotEmpty()
  @IsDate()
  readonly arrivalTime: Date;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly available_occupancy: number;
}
