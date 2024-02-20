const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  img: {
    type: String,
  }
}, {
  timestamps: true
});

const Slide = mongoose.model("Slide", slideSchema);
module.exports = Slide; 