import ApplicationModel from '../Models/ApplicationModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import uploadToCloudinary from '../utils/CloudUpload.js';

const createApplication = asyncHandler(async (req, res) => {
    const { jobId, coverLetter } = req.body;

    let resumeUrl;
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer, 'resumes');
        resumeUrl = result.secure_url;
    } 

    const jobExists = await mongoose.model('Job').findById(jobId);
    if (!jobExists) {
         res.status(404);
        throw new Error(`Job ${jobId} not found`);
    }

    const existingApplication = await ApplicationModel.findOne({ jobId: jobId, userId: req.user._id });
    if (existingApplication) {
         res.status(400);
        throw new Error('You have already applied for this job');
    }


    const newApplication = new ApplicationModel({
        jobId: jobId,
        userId: req.user._id,
        resume: resumeUrl,
        coverLetter
    });

    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully', data: newApplication });
});


const getMyApplications = asyncHandler(async (req, res) => {
    const applications = await ApplicationModel.find({ userId: req.user._id }).populate('jobId', 'title company location salary');
    return res.json({ message: 'Applications retrieved successfully', data: applications });
});


const getApplicationsForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const job = await JobModel.findById(jobId);
    if (!job) {
 res.status(404);
        throw new Error('Job not found');
    }
    if (!job.employer.equals(req.user._id)) {
        res.status(403);
        throw new Error('Unauthorized, you are not the employer for this job');
    }

    const applications = await ApplicationModel.find({ jobId: jobId }).populate('userId', 'username email');
    return res.json({ message: 'Applications retrieved successfully', data: applications });
});


const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const application = await ApplicationModel.findById(req.params.id).populate('jobId', 'title company location workModel salary').populate('userId', 'username email');
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }
    if (!application.jobId.employer.equals(req.user._id)) {
        res.status(403);
        throw new Error('Unauthorized, you are not the employer for this job');
    }

    application.status = status;
    await application.save();

    return res.json({ message: 'Application status updated successfully', data: application });
});


const withdrawApplication = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid application ID');
    }
    const application = await ApplicationModel.findById(req.params.id);
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }
    if (!application.userId.equals(req.user._id)) {
        res.status(403);
        throw new Error('Unauthorized, you can only withdraw your own applications');
    }

    await application.findByIdAndRemove(req.params.id);

    return res.json({ message: 'Application withdrawn successfully' });
});


export {
    createApplication,
    getMyApplications,
    getApplicationsForJob,
    updateApplicationStatus,
    withdrawApplication
};