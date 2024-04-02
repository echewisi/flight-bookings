import { IsNotEmpty, IsString, IsEmail } from '@nestjs/class-validator';

export class BookFlightDto {
  @IsNotEmpty()
  @IsString()
  readonly flightNumber: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
