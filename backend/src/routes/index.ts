import express from 'express';

import accountRoutes from './account';

const routes = express.Router();

routes.use('/account', accountRoutes);

export default routes;
