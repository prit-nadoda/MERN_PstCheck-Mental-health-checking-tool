import mongoose from 'mongoose';

const { Schema } = mongoose;

const optionSchema = new Schema({
  text: {
    type: String,
    required: [true, "Option text is required!"],
    minlength: [2, "Option text must consist of at least 2 characters!"],
    maxlength: [200, "Option text must consist of at most 200 characters!"],
  },
  condition: {
    type: [String], // Array of strings representing different conditions
    default: null, // Allows the condition to be null
  },
  severity:{
    type: String,  // String representing severity level
    required: [true, "Severity text is required!"],
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild',  // Default to Low severity level if not provided.
  }
});

// Create and export the Option model
export const Option = mongoose.model('options', optionSchema);
