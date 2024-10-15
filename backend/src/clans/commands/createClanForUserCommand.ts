
import Command from '../../command';
import AppError, { AppErrorCodes } from '../../extensions/errors';
import type User from '../../users/user';
import Clan from '../clan';

type Params = {
  user: User;
  name: string;
};

class CreateClanForUserCommand extends Command<Params> {
  async execute() {
    const repository = this.db.getRepository(Clan);

    const { name, user } = this.params;

    const existingClan = await repository.findOne({
      where: { name },
    });
    if (existingClan) {
      throw new AppError(
        AppErrorCodes.ALREADY_EXISTS,
        'A clan with this name already exists',
      );
    }

    const clan = new Clan();
    clan.name = name;
    clan.nameNormalized = Clan.normalizeName(name);
    await repository.save(clan);

    await clan.addUser(user, true);

    repository.save(clan);
  }
}

export default CreateClanForUserCommand;
