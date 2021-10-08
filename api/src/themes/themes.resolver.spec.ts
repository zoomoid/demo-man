import { Test, TestingModule } from '@nestjs/testing';
import { ThemesResolver } from './themes.resolver';
import { ThemesService } from './themes.service';

describe('ThemesResolver', () => {
  let resolver: ThemesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThemesResolver, ThemesService],
    }).compile();

    resolver = module.get<ThemesResolver>(ThemesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
