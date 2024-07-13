import express from 'express';

import memberActivityReportRoutes from './member-activity-report';

const clansRoutes = express.Router();

clansRoutes.use('/member-activity-report', memberActivityReportRoutes);

export default clansRoutes;
