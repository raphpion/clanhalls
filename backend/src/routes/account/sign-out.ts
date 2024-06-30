import express from 'express';

import container from '../../container';
import type { Request, Response, NextFunction } from '../../extensions/express';
import { retrieveAuth } from '../../middleware/authMiddleware';
import type { ISessionService } from '../../sessions/sessionService';

const routes = express.Router();

routes.post('/sign-out', retrieveAuth(), signOut);

async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionService = container.resolve<ISessionService>('SessionService');

    if (req.sessionEntity) {
      await sessionService.signOutSession(req.sessionEntity);
    }

    req.session.destroy(console.error);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default routes;
