import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from '../dto/create-flight.dto';
import { BookFlightDto } from '../dto/book-flight.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('flights')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.createFlight(createFlightDto);
  }

  @Post('book')
  @UseGuards(AuthGuard('jwt'))
  async bookFlight(@Body() bookFlightDto: BookFlightDto, @Req() req) {
    const { flightNumber, email } = bookFlightDto;
    const userId = req.user.id;


    return this.flightService.bookFlight(flightNumber, userId, email);
  }

  @Get(':flightNumber')
  async getFlightDetails(@Param('flightNumber') flightNumber: string) {
    const flight = await this.flightService.getFlightByNumber(flightNumber);
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return flight;
  }

  @Get('available')
  async getAvailableFlights() {
    return this.flightService.getAvailableFlights();
  }
}
