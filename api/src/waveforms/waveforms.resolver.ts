import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WaveformsService } from './waveforms.service';
import { Waveform } from './entities/waveform.entity';
import { CreateWaveformInput } from './dto/create-waveform.input';
import { UpdateWaveformInput } from './dto/update-waveform.input';

@Resolver(() => Waveform)
export class WaveformsResolver {
  constructor(private readonly waveformsService: WaveformsService) {}

  @Mutation(() => Waveform)
  createWaveform(@Args('createWaveformInput') createWaveformInput: CreateWaveformInput) {
    return this.waveformsService.create(createWaveformInput);
  }

  @Query(() => [Waveform], { name: 'waveforms' })
  findAll() {
    return this.waveformsService.findAll();
  }

  @Query(() => Waveform, { name: 'waveform' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.waveformsService.findOne(id);
  }

  @Mutation(() => Waveform)
  updateWaveform(@Args('updateWaveformInput') updateWaveformInput: UpdateWaveformInput) {
    return this.waveformsService.update(updateWaveformInput.id, updateWaveformInput);
  }

  @Mutation(() => Waveform)
  removeWaveform(@Args('id', { type: () => Int }) id: number) {
    return this.waveformsService.remove(id);
  }
}
