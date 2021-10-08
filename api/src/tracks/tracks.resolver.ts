import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TracksService } from './tracks.service';
import { Track } from './entities/track.model';
import { CreateTrackInput } from './dto/create-track.input';
import { UpdateTrackInput } from './dto/update-track.input';

@Resolver(() => Track)
export class TracksResolver {
  constructor(private readonly tracksService: TracksService) {}

  @Mutation(() => Track)
  createTrack(@Args('input') createTrackInput: CreateTrackInput) {
    return this.tracksService.create(createTrackInput);
  }

  @Query(() => [Track], { name: 'tracks' })
  findAll() {
    return this.tracksService.findAll();
  }

  @Query(() => Track, { name: 'track' })
  findOne(
    @Args('namespace', { type: () => String }) namespace: string,
    @Args('name', { type: () => String }) name: string,
  ) {
    return this.tracksService.findOne({
      'metadata.namespace': namespace,
      'metadata.name': name,
    });
  }

  @Mutation(() => Track)
  updateTrack(@Args('input') updateTrackInput: UpdateTrackInput) {
    return this.tracksService.update(
      {
        'metadata.namespace': updateTrackInput.metadata.namespace,
        'metadata.name': updateTrackInput.metadata.name,
      },
      updateTrackInput,
    );
  }

  @Mutation(() => Track)
  removeTrack(
    @Args('namespace', { type: () => String }) namespace: string,
    @Args('name', { type: () => String }) name: string,
  ) {
    return this.tracksService.remove({
      'metadata.namespace': namespace,
      'metadata.name': name,
    });
  }
}
