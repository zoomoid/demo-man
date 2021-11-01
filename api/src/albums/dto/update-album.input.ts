import { CreateAlbumInput } from './create-album.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAlbumInput extends PartialType(CreateAlbumInput) {
  @Field()
  id: string;

  @Field(() => [String])
  coverIds: string[];

  @Field()
  themeId: string;
}
