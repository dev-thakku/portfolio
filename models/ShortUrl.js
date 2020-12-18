const mongoose = require('mongoose');

const ShortUrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  clicks: {
    type: String,
    required: true,
    default: 0,
    },
  });

module.exports = mongoose.model('ShortUrl', ShortUrlSchema)