import UAParser from 'ua-parser-js';

import Command from '../../command';
import db from '../../db';
import type User from '../../users/user';
import Session from '../session';

type Params = {
  user: User;
  sessionId: string;
  userAgent: string;
  method: string;
  ip: string;
};

type Result = Session;

class CreateSessionForUserCommand extends Command<Params, Result> {
  async execute() {
    const repository = db.getRepository(Session);

    const { user, sessionId, userAgent, method, ip } = this.params;

    const uaParser = new UAParser(userAgent);
    const deviceType = uaParser.getDevice().type || 'desktop';
    const os = uaParser.getOS().name;
    const browser = uaParser.getBrowser().name;

    const location = await this.getLocationFromIP(ip);

    const session = new Session();
    session.user = Promise.resolve(user);
    session.sessionID = sessionId;
    session.userAgent = userAgent;
    session.method = method;
    session.ipAddress = ip;
    session.deviceType = deviceType;
    session.os = os;
    session.location = location;
    session.browser = browser;
    session.lastSeenAt = new Date();
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14); // 14 days

    return repository.save(session);
  }

  async getLocationFromIP(ip: string) {
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/json`);
      const data = await response.json();

      const result = [data.city, data.region, data.country]
        .filter(Boolean)
        .join(', ');

      return result || 'Unknown location';
    } catch (error) {
      return 'Unknown location';
    }
  }
}

export default CreateSessionForUserCommand;
