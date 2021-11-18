import { CreateAlbumInput } from './create-album.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAlbumInput extends PartialType(CreateAlbumInput) {
  @Field(() => Int)
  id: number;

  @Field(() => [Int])
  coverIds: number[];

  @Field(() => Int)
  themeId: number;
}
