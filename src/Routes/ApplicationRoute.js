import express from 'express';
import {createApplication, getMyApplications, getApplicationsForJob, updateApplicationStatus, withdrawApplication} from '../Controllers/ApplicationController.js';
import authRequired from '../Middleware/Authentication.js';
import authorize from '../Middleware/Authorization.js';
import upload from '../Middleware/Multer.js';

const router = express.Router();

router.post('/', authRequired, authorize('applicant'), upload.single('resume'), createApplication);

router.get('/', authRequired, authorize('applicant'), getMyApplications);

router.get('/job/:jobId', authRequired, authorize('employer'), getApplicationsForJob);

router.patch('/:id/status', authRequired, authorize('employer'), updateApplicationStatus);

router.delete('/:id', authRequired, authorize('applicant'), withdrawApplication);

export default router;