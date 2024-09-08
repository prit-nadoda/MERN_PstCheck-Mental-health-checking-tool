import mongoose from 'mongoose';

const { Schema } = mongoose;

const reportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'User ID is required!'],
  },
  conditions: [{
    condition: {
      type: String,
      required: [true, "Condition name is required!"],
      minlength: [3, "Condition name must consist of at least 3 characters!"],
      maxlength: [100, "Condition name must consist of at most 100 characters!"],
    },
    signs: {
      type: [String], // Array of strings representing the signs for the condition
      required: [true, "Signs are required for the condition!"],
      validate: {
        validator: function (v) {
          return v.length > 0; // Ensure at least one sign is provided
        },
        message: "A condition must have at least one sign!",
      },
    },
    icon: {
      type: String, // URL or path to the condition's icon
      required: [true, "Icon is required!"],
    },
    proportion: {
      type: Number, // Proportion of the signs in percentage (out of 100)
      required: [true, "Proportion is required!"],
      min: [0, "Proportion cannot be less than 0%"],
      max: [100, "Proportion cannot exceed 100%"],
    }
    
  }],
  score: {
    type: Number, // Score for the condition based on user input
    required: [true, "Score is required!"],
    min: [0, "Score cannot be less than 0"],
    max: [100, "Score cannot exceed 100"],
  },
  createdAt: {
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

// Create and export the Report model
export const Report = mongoose.model('reports', reportSchema);
