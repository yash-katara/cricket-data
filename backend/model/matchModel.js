
import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Match 1: India vs Australia"
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  isMatchTied:{type:String,required:true},
  homeTeam: {type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: true }, // or use ObjectId if teams are in a separate collection
  awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'teams', required: true},
  matchWinner: { type: String },    
  tossWinner: { type: String },
  year: { type: Number, required: true },
  tiedWinner:{type: mongoose.Schema.Types.ObjectId, ref: 'teams',},
  tournamentMatchNo:{
    type:Number,
    required:true
  },
  marginSelection: { type: String }, 
  marginValue: { type: Number },
  venue: {
    venue_name: { type: String },
    win: { type: Boolean, default:false },   // team that won most here historically (optional)
    venue_team: { type: String, required: true }
    // team that lost most here historically (optional)
  },
  homeGroup: { type: String ,required:true},
  awayGroup: { type: String ,required:true},
  // Macth number data
  matchNumber: { type: Number, required: true },
  homeMatchNumber: { type: Number, required: true  },
  awayMatchNumber: { type: Number, required: true  },

  // match number data by group
  matchNumberByGroup: { type: Number },
  homeMatchNumberByGroup: { type: Number, required: true  },
  awayMatchNumberByGroup: { type: Number, required: true  },
  match:{type:String},

  matchWinnerByTeam: { type: String }, // similar to winner, included for clarity
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },

  matchDate: { type: Date, required: true },
  // matchType: { type: String, enum: ['group', 'qualifier', 'semi-final', 'final'], default: 'group' },

  createdAt: { type: Date, default: Date.now }
});

// module.exports = mongoose.model('matchs', matchSchema);

const Matchs = mongoose.model('matchs', matchSchema);

export default Matchs;
