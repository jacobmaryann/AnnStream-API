import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['applicant', 'employer', 'admin'],
        default: 'applicant'
    },
    profilePicture: {
        type: String,
        default: null
    }
},
{timestamps: true}
);
const UserModel = model('User', userSchema);

export default UserModel;