import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['action', 'adventure', 'rpg', 'strategy', 'sports', 'simulation'] 
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  developer: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  platform: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
gameSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Game = mongoose.model('Game', gameSchema);

export default { Game };