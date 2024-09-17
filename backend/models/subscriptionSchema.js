import mongoose from 'mongoose';

const { Schema } = mongoose;

const subscriptionSchema = new Schema({
userPlan:{
    _type : {
        type: String,
        required: true,
        default: "premium",
     },
     name: {
        type: String,
        required: [true, "Plan name is required!"],
        default: "Premium plan",
     },
     amount : {
        type: Number,
        required: [true, "Amount is required!"],
        default: 500,
     }
},
doctorPlan:{
    _type : {
        type: String,
        required: true,
        default: "doctor",
     },
     name: {
        type: String,
        required: [true, "Plan name is required!"],
        default: "Doctors plan",
     },

     amount : {
        type: Number,
        required: [true, "Amount is required!"],
        default: 500,
     }
},

});

export const Subscription = mongoose.model('subscriptions', subscriptionSchema);
