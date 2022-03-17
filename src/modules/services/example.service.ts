import Address from '../../database/models/final/address.model';
import { throwError } from '../../utils/http-exception';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

export default class ExampleService {
  static async getItems(): Promise<Address[]> {
    return await Address.findAll();
  }

  static async getItemById(id: string): Promise<Address> {
    const item = await Address.findByPk(id);

    if (!item) {
      throwError({
        statusCode: 404,
        message: `Item with id# ${id} was not found`,
      });
    }

    return item;
  }

  static async createItem(dto: CreateItemDto): Promise<Address> {
    const item = await Address.create(dto);

    return item;
  }

  static async updateItem(id: string, dto: UpdateItemDto): Promise<Address> {
    const item = await this.getItemById(id);

    await item.update(dto);

    return item;
  }

  static async deleteItem(id: string) {
    const item = await this.getItemById(id);

    await item.destroy();
  }
}
