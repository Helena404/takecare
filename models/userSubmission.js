import mongoose from 'mongoose';

const UserSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    objectInfo: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        photo: {
            type: String
        }
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['на рассмотрении', 'одобрено', 'отклонено'],
        default: 'на рассмотрении'
    }
});

const UserSubmission = mongoose.model('UserSubmission', UserSubmissionSchema);

export default UserSubmission;
