import { Schema, model } from 'mongoose';

const applicationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // link to the User model
        required: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job', // link to the Job model
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'in-review', 'accepted', 'rejected'],
        default: 'submitted'
    },
    resume: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    }
}, { timestamps: true });


const ApplicationModel = model('Application', applicationSchema);

export default ApplicationModel;