import express from 'express';

import type { ICredentialsService } from '../../../account/credentialsService';
import container from '../../../container';
import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';

const credentialsClientIdRoutes = express.Router({ mergeParams: true });

credentialsClientIdRoutes.delete('/', requireAuth(), deleteCredentials);

export async function deleteCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const credentialsService =
      container.resolve<ICredentialsService>('CredentialsService');
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { clientId } = req.params;
    console.log(req.params);

    await credentialsService.deleteCredentialsForUser(req.userEntity, clientId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default credentialsClientIdRoutes;
