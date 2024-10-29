import { addWeeks } from 'date-fns';
import Joi from 'joi';

import Seeder from './seeder';
import Session from '../../sessions/session';
import User from '../../users/user';

type SessionSeed = {
  user: string;
  session_id: string;
  method: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  os: string;
  browser: string;
  location: string;
  created_at: string | null;
  expires_at: string | null;
  last_seen_at: string | null;
  signed_out_at: string | null;
};

const sessionSeedSchema = Joi.object<Record<string, SessionSeed>>().pattern(
  Joi.string(),
  Joi.object({
    user: Joi.string().required(),
    session_id: Joi.number()
      .integer()
      .strict()
      .custom((v) => v.toString())
      .required(),
    method: Joi.string().required(),
    ip_address: Joi.string().required(),
    user_agent: Joi.string().required(),
    device_type: Joi.string().required(),
    os: Joi.string().required(),
    browser: Joi.string().required(),
    location: Joi.string().required(),
    created_at: Joi.string().allow(null).optional().default(null),
    expires_at: Joi.string().allow(null).optional().default(null),
    last_seen_at: Joi.string().allow(null).optional().default(null),
    signed_out_at: Joi.string().allow(null).optional().default(null),
  }),
);

class SessionSeeder extends Seeder<Session, SessionSeed> {
  entityName = Session.name;
  schema = sessionSeedSchema;

  protected deserialize(seed: SessionSeed): Session {
    const user = this.seedingService.getEntity(User, seed.user);
    if (!user) {
      console.log(`User not found: ${seed.user}. Skipping...`);
      return;
    }

    const session = new Session();
    session.user = Promise.resolve(user);
    session.sessionID = seed.session_id;
    session.method = seed.method;
    session.ipAddress = seed.ip_address;
    session.userAgent = seed.user_agent;
    session.deviceType = seed.device_type;
    session.os = seed.os;
    session.browser = seed.browser;
    session.location = seed.location;
    session.createdAt = seed.created_at
      ? new Date(seed.created_at)
      : new Date();
    session.expiresAt = seed.expires_at
      ? new Date(seed.expires_at)
      : addWeeks(session.createdAt, 2);
    session.lastSeenAt = seed.last_seen_at
      ? new Date(seed.last_seen_at)
      : session.createdAt;
    session.signedOutAt = seed.signed_out_at
      ? new Date(seed.signed_out_at)
      : null;

    return session;
  }

  protected async getIdentifier(entity: Session): Promise<string> {
    const user = await entity.user;
    return `${user.id}-${entity.sessionID}`;
  }
}

export default SessionSeeder;
