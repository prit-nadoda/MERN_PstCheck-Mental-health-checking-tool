import mongoose from 'mongoose';

const { Schema } = mongoose;

const subscriptionSchema = new Schema({

    _type : {
        type: String,
        required: true,
        enum: ["plus","mentor", "starter"],
        default: "starter",
        unique: true, 
     },
     badge:{
       type: String,
       required: [true, "Badge is required!"],
     },
     name: {
        type: String,
        required: [true, "Plan name is required!"],
        default: "Calm Starter",
        unique: true, 
     },
     amount : {
        type: Number,
        required: [true, "Amount is required!"],
        default: 0,
     }, 
     description:{
       type: String,
       required: [true, "Description is required!"],
       default: "Ideal for those who want comprehensive mental health support with minimum features.",
     },
     features: {
       type: [String],
     },

});

export const Subscription = mongoose.model('subscriptions', subscriptionSchema);
