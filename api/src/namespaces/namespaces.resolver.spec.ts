import { Test, TestingModule } from '@nestjs/testing';
import { NamespacesResolver } from './namespaces.resolver';
import { NamespacesService } from './namespaces.service';

describe('NamespacesResolver', () => {
  let resolver: NamespacesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NamespacesResolver, NamespacesService],
    }).compile();

    resolver = module.get<NamespacesResolver>(NamespacesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
