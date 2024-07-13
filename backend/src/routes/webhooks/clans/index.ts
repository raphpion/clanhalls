import express from 'express';

import memberActivityReportRoutes from './member-activity-report';
import settingsReportRoutes from './settings-report';

const clansRoutes = express.Router();

clansRoutes.use('/member-activity-report', memberActivityReportRoutes);
clansRoutes.use('/settings-report', settingsReportRoutes);

export default clansRoutes;
