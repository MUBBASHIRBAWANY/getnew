import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});

export const CounterModel = mongoose.model('Counter', CounterSchema);
