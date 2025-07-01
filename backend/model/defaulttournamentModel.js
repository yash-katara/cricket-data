
import mongoose from 'mongoose';
const defaulTournamentSchema = new mongoose.Schema({
  name: { type: String ,required: true},
  // countryId:{type: mongoose.Schema.Types.ObjectId, ref: 'country'},
  shortName:{ type: String ,required: true},
  contry: { type: mongoose.Schema.Types.ObjectId, ref: 'country'},
  startYear:{type:String,required: true}
}, { timestamps: true });

export default mongoose.model('defaulTournament', defaulTournamentSchema);
