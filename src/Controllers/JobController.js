import JobModel from '../Models/JobModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

const createJob = asyncHandler(async (req, res) => {
    const { company, title, description, location, workModel, salary, expirationDate } = req.body;

    const newJob = new JobModel({
        company,
        title,
        description,
        location,
        workModel,
        salary,
        employer: req.user._id,
        expirationDate
    });

    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', data: newJob });
});

const getAllJobs = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    const search = req.query.q;
    if (search) {
        query.$text = { $search: search };
    }
    const jobs = await JobModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).populate('employer', 'username email ');
    res.json({ message: 'Jobs retrieved successfully', data: jobs });
}
);


const getJobById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
         res.status(400);
         throw new Error({ error: 'Invalid job ID' });
    }
    const job = await JobModel.findById(req.params.id).populate('employer', 'username email ');
    if (!job) {
        return res.status(404).json({ error: `Job with id ${req.params.id} not found` });
    }
    res.json({ message: 'Job retrieved successfully', data: job });
});


const updateJobById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
         res.status(400);
        throw new Error({ error: 'Invalid job ID' });
    }

    const job = await JobModel.findById(req.params.id);
    if (!job) {
         res.status(404);
        throw new Error({ error: `Job with id ${req.params.id} not found` });
    }

    if(!job.employer.equals(req.user._id)) {
         res.status(403);
        throw new Error({ error: 'Unauthorized, you can only update your own jobs' });
    }
    const UpdatedJob = await JobModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true
     }).populate('employer', 'username email ');
    
     res.json({ message: 'Job updated successfully', data: UpdatedJob });
});


const deleteJobById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
         res.status(400);
        throw new Error({ error: 'Invalid job ID' });
    }

    const job = await JobModel.findById(req.params.id);
    if (!job) {
         res.status(404);
        throw new Error({ error: `Job with id ${req.params.id} not found` });
    }

    if(!job.employer.equals(req.user._id)) {
         res.status(403);
        throw new Error({ error: 'Unauthorized, you can only delete your own jobs' });
    }

    await JobModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
});


export { createJob, getAllJobs, getJobById, updateJobById, deleteJobById };

