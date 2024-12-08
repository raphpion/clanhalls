import express from 'express';

import adminUsersRoute from './users';
import { requireSuperAdmin } from '../../middleware/authMiddleware';

const adminRoutes = express.Router();

adminRoutes.use(requireSuperAdmin());
adminRoutes.use('/users', adminUsersRoute);

export default adminRoutes;
