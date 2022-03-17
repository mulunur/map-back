import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    timestamps: true,
})
export default class Polygon extends Model {
    @Column({
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
        primaryKey: true,
    })
    public id!: string;

    @Column({
        allowNull: true,
        type: DataType.GEOGRAPHY('POLYGON'),
        primaryKey: false,
    })
    public data!: any;
}