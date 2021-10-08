import { Test, TestingModule } from '@nestjs/testing';
import { NamespacesService } from './namespaces.service';

describe('NamespacesService', () => {
  let service: NamespacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NamespacesService],
    }).compile();

    service = module.get<NamespacesService>(NamespacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
