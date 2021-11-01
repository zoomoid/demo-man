import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsResolver } from './albums.resolver';
import { AlbumsService } from './albums.service';

describe('AlbumsResolver', () => {
  let resolver: AlbumsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumsResolver, AlbumsService],
    }).compile();

    resolver = module.get<AlbumsResolver>(AlbumsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
