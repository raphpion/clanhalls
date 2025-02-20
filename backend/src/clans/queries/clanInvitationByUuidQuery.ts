import Query from '../../query';
import ClanInvitation from '../clanInvitation';

type Params = {
  uuid: string;
};

export type ClanInvitationData = {
  uuid: string;
  code: string;
  description: string | null;
  sender: {
    username: string;
    pictureUrl: string | null;
  };
  clan: {
    name: string;
    nameInGame: string;
  };
  uses: number;
  expiredAt: Date | null;
  disabledAt: Date | null;
  maxUses: number | null;
};

type Result = ClanInvitationData | null;

class ClanInvitationByUuidQuery extends Query<Params, Result> {
  async execute() {
    const repository = this.db.getRepository(ClanInvitation);

    const { uuid } = this.params;

    const clanInvitation = await repository.findOne({
      where: { uuid },
      relations: ['sender', 'clan'],
    });

    if (!clanInvitation) {
      return null;
    }

    const sender = await clanInvitation.sender;
    const clan = await clanInvitation.clan;

    return {
      uuid: clanInvitation.uuid,
      description: clanInvitation.description,
      code: clanInvitation.code,
      sender: {
        username: sender.username,
        pictureUrl: sender.pictureUrl,
      },
      clan: {
        name: clan.name,
        nameInGame: clan.nameInGame,
      },
      uses: clanInvitation.uses,
      expiredAt: clanInvitation.expiresAt,
      disabledAt: clanInvitation.disabledAt,
      maxUses: clanInvitation.maxUses,
    };
  }
}

export default ClanInvitationByUuidQuery;
