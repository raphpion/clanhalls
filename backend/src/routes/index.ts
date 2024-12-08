import express from 'express';

import accountRoutes from './account';
import adminRoutes from './admin';
import webhooksRoutes from './webhooks';

const routes = express.Router();

routes.use('/account', accountRoutes);
routes.use('/admin', adminRoutes);
routes.use('/webhooks', webhooksRoutes);

export default routes;
