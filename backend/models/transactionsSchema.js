import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'User ID is required!'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required!'],
    min: [0, 'Amount must be a positive number'],
  },
  plan: {
    type: String,
    required: [true, 'Plan is required!'],
    default: 'starter',
    enum: ['starter', 'plus', 'mentor'],
  },
  transaction_status:{
    type: String,
    required: [true, 'Transaction status is required!'],
  },
  session_id: {
    type: String,
    required: [true, 'Session ID is required!'],
    unique: true,
    
    select: false,
  },
  date: {
    type: Date,
    default: Date.now,
    get: function(date) {
      const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }
});

// Create and export the Condition model
export const Transaction = mongoose.model('transactions', transactionSchema);
