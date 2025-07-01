import mongoose from 'mongoose';



const tournamentSchema = new mongoose.Schema({
  tournamentForMatType: { type: mongoose.Schema.Types.ObjectId, ref: 'TournamentFormate',required:true },
  name: { type: String, required: true },
  // seasonPrevious: { type: String,required:true},
  season: { type: String,required:true},
  hostCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'country' },
  type: { type: String, enum: ['men', 'women'], required: true },
  isGroup:{type:String,required:true},
  defaulttournamentID:{type: mongoose.Schema.Types.ObjectId, ref: 'defaulTournaments'},
  noOfGruop:{type:Number},
  leagsMatchesNo:{type:Number},
  // playOffsNo:{type:Number},
  groups:{type:[]},
  numberOfTeams:{type:Number},
  teams: [{
    team:{type: mongoose.Schema.Types.ObjectId, ref: 'teams'},
  }],
  startDate: Date,
  endDate: Date,
},{timestamps:true});

const Tournament = mongoose.model('tournament', tournamentSchema);

export default Tournament;
