import mongoose from 'mongoose';

const tournamentFormateSchema = new mongoose.Schema({
  formateName: { type: String, required: true },      // e.g., "2023 Season"
  playoffCount: { type: Number, required: true },     // e.g., 3
  playoffs: [{ type: String }]                        // Array of strings like ["QF", "SF", "F"]
}, {
  timestamps: true
});

export default mongoose.model('TournamentFormate', tournamentFormateSchema);
