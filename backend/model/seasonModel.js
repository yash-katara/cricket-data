import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  year: { type: Number, required: true },
},{
    timestamps:true
});

export default mongoose.model('season', seasonSchema);