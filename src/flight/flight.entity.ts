import { PrimaryColumn, Column, Entity, BeforeInsert } from 'typeorm';

@Entity('flight')
export class FlightEntity {
  @PrimaryColumn({ length: 6 }) // Assuming 6 characters for the hotel tag
  flightNumber: string;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 100 })
  destination: string;

  @Column()
  departureTime: Date;

  @Column()
  arrivalTime: Date;

  @Column()
  price: number;

  @Column({ nullable: true })
  available_occupancy: number;

  @Column({ default: false })
  occupancy_filled: boolean;

  @Column('simple-array', { nullable: true })
  occupants: string[];

  @BeforeInsert()
  generateHotelTag() {
    this.flightNumber = this.generateUniqueKey();
  }

  private generateUniqueKey(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }
}
