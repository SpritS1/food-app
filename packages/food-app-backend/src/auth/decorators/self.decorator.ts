import { SetMetadata } from '@nestjs/common';

export interface OwnerDecoratorParams {
  userId: string;
  allowAdmins?: boolean;
}

export const Owner = (params: OwnerDecoratorParams | string) =>
  SetMetadata(
    'ownerParams',
    typeof params == 'string' ? { userId: params } : params,
  );
