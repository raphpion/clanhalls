import Query from '../../query';
import ClanInvitation from '../clanInvitation';

type Params = {
  code: string;
};

type ClanInvitationVerificationData = {
  valid: boolean;
  clan?: {
    name: string;
    nameInGame: string;
  };
  sender?: {
    username: string;
    pictureUrl: string | null;
  };
};

type Result = ClanInvitationVerificationData;

class VerifyClanInvitationQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(ClanInvitation);

    const { code } = this.params;

    const clanInvitation = await repository.findOne({
      where: { code },
      relations: ['sender', 'clan'],
    });

    if (!clanInvitation?.isAvailable) return { valid: false };

    const sender = await clanInvitation.sender;
    const clan = await clanInvitation.clan;

    return {
      valid: true,
      clan: {
        name: clan.name,
        nameInGame: clan.nameInGame,
      },
      sender: {
        username: sender.username,
        pictureUrl: sender.pictureUrl,
      },
    };
  }
}

export default VerifyClanInvitationQuery;
