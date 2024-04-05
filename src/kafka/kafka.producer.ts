import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private kafka: Kafka;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'flight-booking-producer',
      brokers: [process.env.KAFKA_HOST || 'localhost:9092'],
      logLevel: logLevel.INFO,
    });

    this.producer = this.kafka.producer();
  }

  async sendFlightBookedEvent(flightNumber: string) {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: 'flight-events',
        messages: [
          { value: JSON.stringify({ type: 'flightBooked', flightNumber }) },
        ],
      });
    } catch (error) {
      console.error('Error occurred while sending flight booked event:', error);
    } finally {
      await this.producer.disconnect();
    }
  }
}
