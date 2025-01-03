import { Test, TestingModule } from '@nestjs/testing';
import { RecentSongNoSpecService } from './recent-song--no-spec.service';

describe('RecentSongNoSpecService', () => {
  let service: RecentSongNoSpecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentSongNoSpecService],
    }).compile();

    service = module.get<RecentSongNoSpecService>(RecentSongNoSpecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
