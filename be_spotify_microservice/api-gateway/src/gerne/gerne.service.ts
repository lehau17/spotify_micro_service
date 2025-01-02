import { Inject, Injectable } from '@nestjs/common';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';

@Injectable()
export class GerneService {
  constructor(
    @Inject('GERNE_SERVICE') private readonly gerneService: ClientProxy,
  ) {}
  create(createGerneDto: CreateGerneDto) {
    return lastValueFrom(
      this.gerneService
        .send('createGerne', createGerneDto)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
  }

  findAll() {
    return `This action returns all gerne`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gerne`;
  }

  update(id: number, updateGerneDto: UpdateGerneDto) {
    return `This action updates a #${id} gerne`;
  }

  remove(id: number) {
    return `This action removes a #${id} gerne`;
  }
}
