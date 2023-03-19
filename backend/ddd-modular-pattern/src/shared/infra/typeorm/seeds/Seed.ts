import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class Seed implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    console.info('Seed', connection);
  }
}
