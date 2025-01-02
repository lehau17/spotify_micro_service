import { Inject, Injectable } from '@nestjs/common';
import { CreateGerneDto } from './dto/create-gerne.dto';
import { UpdateGerneDto } from './dto/update-gerne.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRetryWithBackoff } from 'src/common/utils/handlerTimeoutWithBackoff';
import { PagingDto } from 'src/common/paging/paging.dto';

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

  findAll(paging: PagingDto) {
    paging.fullFill();
    return lastValueFrom(
      this.gerneService
        .send('findAllGerne', paging)
        .pipe(handleRetryWithBackoff(3, 1000)),
    );
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
