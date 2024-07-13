import express from 'express';

import accountRoutes from './account';
import webhooksRoutes from './webhooks';

const routes = express.Router();

routes.use('/account', accountRoutes);
routes.use('/webhooks', webhooksRoutes);

export default routes;
