import express from 'express';

import adminUsersGoogleIdRoute from './[googleId]';
import type {
  Request,
  Response,
  NextFunction,
} from '../../../extensions/express';
import AdminListUsersQuery, {
  type Params as AdminListUsersQueryParams,
} from '../../../users/queries/adminListUsersQuery';

const adminUsersRoute = express.Router();

adminUsersRoute.get('/', queryUsers);
adminUsersRoute.use('/:googleId', adminUsersGoogleIdRoute);

async function queryUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { ipp, page, sort, order, search } = req.query;

    const data = await new AdminListUsersQuery({
      ipp: ipp ? Number(ipp) : 50,
      page: page ? Number(page) : 1,
      search: search as string,
      orderBy: {
        field: (sort ||
          'username') as AdminListUsersQueryParams['orderBy']['field'],
        order: (order ||
          'ASC') as AdminListUsersQueryParams['orderBy']['order'],
      },
      withTotalCount: true,
    }).execute();

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export default adminUsersRoute;
