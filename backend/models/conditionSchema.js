import mongoose from 'mongoose';

const { Schema } = mongoose;

const conditionSchema = new Schema({
  condition: {
    type: String,
    required: [true, "Condition name is required!"],
    minlength: [3, "Condition name must consist of at least 3 characters!"],
    maxlength: [100, "Condition name must consist of at most 100 characters!"],
  },
  icon: {
    type: String, // URL or path to the condition's icon
    required: [true, "Icon is required!"],

  },
  info: {
    type: String,
    // required: [true, "Info about the condition is required!"],
    // minlength: [10, "Condition info must consist of at least 10 characters!"],
  },
  tips: {
    type: [String], // Array of strings for tips
    default: [], // Default to an empty array if no tips are provided
  },
});

// Create and export the Condition model
export const Condition = mongoose.model('conditions', conditionSchema);
