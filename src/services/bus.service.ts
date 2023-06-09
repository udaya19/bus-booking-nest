import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddBusDTO } from 'src/dto/bus.dto';

import { Bus } from 'src/entities/bus.entity';
import { Service } from 'src/entities/service.entity';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus) private busRepository: Repository<Bus>,
    @InjectRepository(Service)
    private busServiceNumberRepository: Repository<Service>,
  ) {}
  getHello(): string {
    return 'Hello';
  }

  async getBusesById(id: number): Promise<Bus> {
    // const bus = await this.busRepository.findOneBy({ id });
    // if (!bus) return null;
    // return bus;
    const bus = await this.busRepository
      .createQueryBuilder('bus')
      .leftJoinAndSelect('bus.service', 'service')
      .leftJoinAndSelect('bus.seats', 'seat')
      .where('bus.id = :id', { id })
      .getOne();
    if (!bus) return null;
    return bus;
  }

  async addBus(addBusDto: AddBusDTO): Promise<Bus> {
    const service = await this.busServiceNumberRepository.findOneBy({
      serviceNumber: addBusDto.serviceNumber,
    });
    if (!service) {
      return null;
    }
    const newBus = new Bus();
    newBus.name = addBusDto.name;
    newBus.busType = addBusDto.busType;
    newBus.numberPlate = addBusDto.numberPlate;
    service.buses?.push(newBus);
    newBus.service = service;
    await this.busServiceNumberRepository.save(service);
    return await this.busRepository.save(newBus);
  }
}
