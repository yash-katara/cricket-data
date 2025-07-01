
  import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  tournamentId:{type: mongoose.Schema.Types.ObjectId, ref: 'tournaments'},
  teamId: { type: Number },
  fullName: { type: String, required: true },
  shortName: { type: String, required: true },
  py_team_postion:{ type: Number, required: true }, 
  ty_team_postion:{ type: Number, required: true },
  ty_team_result:{ type: String, required: true }, 
  ty_team_result_position:{ type: Number, required: true }, 
  ty_team_group_position:{ type: Number, required: true }, 
  group: { type: String },
  venue1:{type: String },
  venue2:{type: String },
  venue3:{type: String },

  extraTeam:{type: String,required:true },

  

}, { timestamps: true });

export default mongoose.model('teams', teamSchema);
