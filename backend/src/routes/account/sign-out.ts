import express from 'express';

import type { Request, Response, NextFunction } from '../../extensions/express';
import { retrieveAuth } from '../../middleware/authMiddleware';
import SignOutSessionCommand from '../../sessions/commands/signOutSessionCommand';

const routes = express.Router();

routes.post('/sign-out', retrieveAuth(), signOut);

async function signOut(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.sessionEntity) {
      await new SignOutSessionCommand({ session: req.sessionEntity }).execute();
    }

    req.session.destroy(console.error);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default routes;
