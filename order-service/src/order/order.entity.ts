import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Order extends Model<Order> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amountCents: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'created',
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.INTEGER,
  })
  transactionId: number;
}
