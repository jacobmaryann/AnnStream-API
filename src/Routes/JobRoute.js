import express from 'express';
import {createJob, getAllJobs, getJobById, updateJobById, deleteJobById} from '../Controllers/JobController.js';
import authRequired from '../Middleware/Authentication.js';
import authorize from '../Middleware/Authorization.js';
import {validatePost} from '../Validators/ValidatePost.js';
import {validateUpdate} from '../Validators/ValidatePatch.js';

const router = express.Router();

router.post('/', authRequired, authorize('employer'), validatePost, createJob);

router.get('/', getAllJobs);

router.get('/:id', getJobById);

router.patch('/:id', authRequired, authorize('employer'), validateUpdate, updateJobById);

router.delete('/:id', authRequired, authorize('employer'), deleteJobById);

export default router;