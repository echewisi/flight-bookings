import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightEntity } from './flight.entity';
import { CreateFlightDto } from '../dto/create-flight.dto';
import { BookFlightDto } from '../dto/book-flight.dto';
import { KafkaProducerService } from '../kafka/kafka.producer';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(FlightEntity)
    private readonly flightRepository: Repository<FlightEntity>,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async createFlight(createFlightDto: CreateFlightDto): Promise<FlightEntity> {
    const flight = this.flightRepository.create(createFlightDto);
    return await this.flightRepository.save(flight);
  }

  async bookFlight(
    flightNumber: string,
    userId: string,
    userEmail: string,
  ): Promise<any> {
    const flight = await this.flightRepository.findOne({ flightNumber });

    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    if (flight.occupancy_filled) {
      throw new BadRequestException('Flight occupancy filled');
    }

    flight.available_occupancy -= 1;
    if (flight.available_occupancy === 0) {
      flight.occupancy_filled = true;
    }

    if (!flight.occupants) {
      flight.occupants = [];
    }
    flight.occupants.push(userId);

    await this.flightRepository.save(flight);

    const flightTicket = this.generateFlightTicket();

    // Send flight number to Kafka producer
    await this.kafkaProducer.sendFlightBookedEvent(flightNumber);

    return { flightTicket, flightNumber, userId, userEmail };
  }

  async getFlightByNumber(flightNumber: string): Promise<FlightEntity> {
    return this.flightRepository.findOne({ flightNumber });
  }

  async getAvailableFlights(): Promise<FlightEntity[]> {
    return this.flightRepository.find({ occupancy_filled: false });
  }

  private generateFlightTicket(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let ticket = '';
    for (let i = 0; i < 6; i++) {
      ticket += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return ticket;
  }
}
