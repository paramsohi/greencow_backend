import { Router } from 'express';
import { validate } from '../../../../common/middleware/validate';
import {
	cleanupApiLogs,
	listApiLogs,
	viewApiLogsDashboard,
	viewApiLogsDashboardScript,
} from '../controllers/api-logs.controller';
import { cleanupApiLogsSchema, listApiLogsSchema } from '../validators/api-logs.validator';

export const apiLogsRoutes = Router();

apiLogsRoutes.get('/', validate(listApiLogsSchema), listApiLogs);
apiLogsRoutes.get('/view', viewApiLogsDashboard);
apiLogsRoutes.get('/view.js', viewApiLogsDashboardScript);
apiLogsRoutes.delete('/cleanup', validate(cleanupApiLogsSchema), cleanupApiLogs);