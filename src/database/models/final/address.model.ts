import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class Address extends Model {
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    type: DataType.UUID
  })
  public placeId!: string;

  @Column
  public displayTitle!: string;

  @Column
  public displayDescription!: string;

  @Column
  public coordinates!: string;

  @Column
  public polygon!: string;

  @Column
  public components!: string;
}
