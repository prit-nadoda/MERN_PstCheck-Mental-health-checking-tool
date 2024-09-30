import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedbacksSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Patient ID is required!'],
    },
     messege: {
        type: String,
        required: [true, "Message is required!"],
        minlength: [15, 'Message must be at least 15 characters'],      
     },
     expert : {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Experts ID is required!'],
     }, 

});

export const Feedback = mongoose.model('feedbacks', feedbacksSchema);
