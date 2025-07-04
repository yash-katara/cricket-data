import Match from '../models/Match.js';
import Team from '../model/teamsModel';
import Tournament from "../model/tournament.js";
import mongoose, { Types } from "mongoose";

const matchService = async(matchdata)=>{

    try {
    if(!matchdata){
        const error = new Error("Match data is required");
        error.statusCode = 400;
        throw error;
    }

    const{homeTeam, awayTeam, year, matchWinner, tournament, venue_team, isMatchTied, tiedWinner,tournamentMatchNo,marginValue,marginSelection,tossWinner} = matchdata;
    if (!homeTeam || !awayTeam || !matchWinner) {
      const error = new Error("Missing required fields in match data.");
      error.statusCode = 400;
      throw error;
    }

    const existTournamentMatchNo = await Match.findOne({tournament:new Types.ObjectId(tournament), tournamentMatchNo: tournamentMatchNo });
    if(existTournamentMatchNo){
        const error = new Error("Match with this tournament and match number already exists.");
        error.statusCode = 400;
        throw error;
    }

    const validTiedWinner = tiedWinner && tiedWinner !== "" ? new Types.ObjectId(tiedWinner) : null;

    const totalMatchCount = await Match.countDocuments();
    const now = new Date();

     let homeTeamDoc = await Team.findOne({ _id:new Types.ObjectId(homeTeam)  });
    let awayTeamDoc = await Team.findOne({ _id:new Types.ObjectId( awayTeam)  });
    
    if (homeTeam === awayTeam) {
      const error = new Error("Home team and Away team cannot be the same.");
      error.statusCode = 400;
      throw error;
    }
    

    if (!homeTeamDoc) {
      const error = new Error(`Home team  not found.`);
      error.statusCode = 404;
      throw error;
    }

    if (!awayTeamDoc) {
      const error = new Error(`Away team  not found.`);
      error.statusCode = 404;
      throw error;
    }


    const matchStatus = matchdata?.status||'scheduled';
    

     const homeMatchNumberCount = await Match.countDocuments({ homeTeam:new Types.ObjectId(homeTeam) });
     
     const awayMatchNumberCount = await Match.countDocuments({  awayTeam:new Types.ObjectId(awayTeam) });

     const tournamentDoc = await Tournament.findById(tournament).populate('teams.team');
     if (!tournamentDoc) {
       const error = new Error(`Tournament not found.`);
       error.statusCode = 404;
       throw error;
     }
    let hgroup = homeTeamDoc?.group
    let AGroup = awayTeamDoc?.group
    

    const homeMatchNumberByGroup = await Match.countDocuments({homeTeam:new Types.ObjectId(homeTeam) , homeGroup: hGroup }) + 1;
    const awayMatchNumberByGroup = await Match.countDocuments({awayTeam:new Types.ObjectId(awayTeam) , awayGroup: AGroup }) + 1;
    const matchNumberByGroup = await Match.countDocuments({ group: hGroup }) + 1;

    const venue = {
      venue_name:homeTeamDoc?.venue1,
      venue_team:homeTeamDoc.shortName,
      win: matchWinner === venue_team
    };
    
    const newMatch = new Match({
      name: `${homeTeamDoc.shortName} vs ${awayTeamDoc.shortName}`,
      tournament,
      matchNumber: totalMatchCount + 1,
      homeTeam,
      awayTeam,
      matchWinner,
      year,
      venue,
      matchDate: now,
      matchWinnerByTeam: matchWinner || null,
      // group:homeTeamDoc?.group,
      tournamentMatchNo,
      marginValue,
      marginSelection,      // matchType: group ? 'group' : 'qualifier',
      status: matchStatus,
      homeMatchNumber: homeMatchNumberCount + 1,
      awayMatchNumber: awayMatchNumberCount + 1,
      homeMatchNumberByGroup,
      awayMatchNumberByGroup,
      matchNumberByGroup,
      isMatchTied,
      tiedWinner:validTiedWinner,
      tossWinner,
      homeGroup:homeTeamDoc?.group,
      awayGroup:awayTeamDoc?.group,
    });

    const savedMatch = await newMatch.save();
    return savedMatch;
}
catch (error) {
    throw error;
    }
};

export const getMatchesService = async (tournamentId) => {
  try {
    let matches;

    const populateShortName = {
      path: 'homeTeam awayTeam tiedWinner',
      select: 'shortName group' // Only fetch the shortName field
    };

    if (!tournamentId || tournamentId === "null") {
      matches = await Match.find().populate(populateShortName).sort({ tournamentMatchNo: 1 });
    } else {
      matches = await Match.find({ tournament: tournamentId }).populate(populateShortName).sort({ tournamentMatchNo: 1 });
    }


    // console.log(matches, "matches with team short names");
    return matches;
  } catch (error) {
    console.error('Error in getMatchesService:', error);
    throw error;
  }
};




export const updateMatchService = async (matchId, matchData) => {
  try {
    if (!matchId || !matchData) {
      const error = new Error("Missing match ID or match data.");
      error.statusCode = 400;
      throw error;
    }

    const {
      homeTeam,
      awayTeam,
      winner,
      tournament,
      tossByTeam,
     margin,
      venue_team,
    } = matchData;

    if (!homeTeam || !awayTeam || !winner) {
      const error = new Error("Missing required fields in match data.");
      error.statusCode = 400;
      throw error;
    }

    // Check if tiedWinner is empty, and if so, set it to null
    const validTiedWinner = tiedWinner && tiedWinner !== "" ? new Types.ObjectId(tiedWinner) : null;

    let homeTeamDoc = await Team.findOne({ _id: new Types.ObjectId(homeTeam) });
    let awayTeamDoc = await Team.findOne({ _id: new Types.ObjectId(awayTeam) });

    if (homeTeam === awayTeam) {
      const error = new Error("Home team and Away team cannot be the same.");
      error.statusCode = 400;
      throw error;
    }

    if (!homeTeamDoc || !awayTeamDoc) {
      const error = new Error("Home team or Away team not found.");
      error.statusCode = 404;
      throw error;
    }

    const match = await Match.findById(matchId);
    if (!match) {
      const error = new Error("Match not found.");
      error.statusCode = 404;
      throw error;
    }
    // Update the match with the new data
    match.homeTeam = homeTeam;
    match.awayTeam = awayTeam;
    match.winner = winner;
    match.tournament = tournament;
    match.tossByTeam = tossByTeam;
    match.margin = margin;    match.margin = margin;
    match.venue_team = venue_team;
    // Save the updated match document
    const updatedMatch = await match.save();
    return updatedMatch;

  } catch (error) {
    throw error;
  }
};


export default matchService;
