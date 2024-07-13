import express from 'express';

import clansRoutes from './clans';

const webhooksRoutes = express.Router();

webhooksRoutes.use('/clans', clansRoutes);

export default webhooksRoutes;
