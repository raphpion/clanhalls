import express from 'express';
import Joi from 'joi';

import AppError, { AppErrorCodes } from '../../../extensions/errors';
import type {
  NextFunction,
  Request,
  Response,
} from '../../../extensions/express';
import { requireAuth } from '../../../middleware/authMiddleware';
import validate from '../../../middleware/validationMiddleware';
import DeleteCredentialsCommand from '../../../users/credentials/commands/deleteCredentialsCommand';
import UpdateCredentialsCommand from '../../../users/credentials/commands/updateCredentialsCommand';

type UpdateCredentialsPayload = {
  name: string;
  scope: string;
};

const updateCredentialsPayloadSchema = Joi.object<UpdateCredentialsPayload>({
  // TODO: Add validation for name
  name: Joi.string().required(),
  // TODO: Add validation for scope
  scope: Joi.string().required(),
});

const credentialsClientIdRoutes = express.Router({ mergeParams: true });

credentialsClientIdRoutes.delete('/', requireAuth(), deleteCredentials);
credentialsClientIdRoutes.put(
  '/',
  requireAuth(),
  validate(updateCredentialsPayloadSchema),
  updateCredentials
);

export async function deleteCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { clientId } = req.params;

    await new DeleteCredentialsCommand({
      clientId,
    }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function updateCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userEntity) {
      throw new AppError(AppErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const { clientId } = req.params;
    const updates = req.body as UpdateCredentialsPayload;

    await new UpdateCredentialsCommand({
      clientId,
      updates,
    }).execute();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export default credentialsClientIdRoutes;
