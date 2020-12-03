import { IsNotEmpty } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly amount: number;

  @IsNotEmpty()
  readonly status: string;
}
