const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create Schema

const PollSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  pollqtext: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  pollOptions: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      pollOptionText: {
        type: String,
        required: true
      },
      votes: []
    }
  ]
});

module.exports = Poll = mongoose.model("poll", PollSchema);
