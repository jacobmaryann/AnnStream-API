import { Schema, model } from 'mongoose';

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    workModel: {
        type: String,
        enum: ['Remote', 'Onsite', 'Hybrid'],
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    employer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text', workModel: 'text' });

const JobModel = model('Job', jobSchema);

export default JobModel;