import { Test, TestingModule } from '@nestjs/testing';
import { RecentSongNoSpecController } from './recent-song--no-spec.controller';
import { RecentSongNoSpecService } from './recent-song--no-spec.service';

describe('RecentSongNoSpecController', () => {
  let controller: RecentSongNoSpecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentSongNoSpecController],
      providers: [RecentSongNoSpecService],
    }).compile();

    controller = module.get<RecentSongNoSpecController>(RecentSongNoSpecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
