import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class Place extends Model {
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
    primaryKey: true,
  })
  public id!: string;

  @Column
  public name!: string;

  @Column
  public displayDescription!: string;

  @Column
  public coordinates!: string;

  @Column
  public polygon!: string;
}
