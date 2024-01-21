import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DaysOfWeek } from 'src/enums/daysOfWeek.enum';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema()
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Cuisine', required: true })
  cuisine: Types.ObjectId;

  @Prop({ required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({
    type: Object,
  })
  openingHours: Record<DaysOfWeek, { open: Date; close: Date }>;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
