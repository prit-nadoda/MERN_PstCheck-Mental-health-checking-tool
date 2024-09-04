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
    type: [String], // Array of strings
    default: null,
  },
});

const questionSchema = new Schema({
  text: {
    type: String,
    required: [true, "Question text is required!"],
    minlength: [10, "Question text must consist of at least 10 characters!"],
    maxlength: [500, "Question text must consist of at most 500 characters!"],
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (options) {
        return options.length === 4;
      },
      message: 'A question must have exactly four options.',
    },
  },
});



export const Question = mongoose.model('questions', questionSchema);

