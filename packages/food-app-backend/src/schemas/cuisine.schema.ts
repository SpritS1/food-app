import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CuisineDocument = HydratedDocument<Cuisine>;

@Schema()
export class Cuisine {
  @Prop({ required: true })
  name: string;
}

export const CuisineSchema = SchemaFactory.createForClass(Cuisine);
