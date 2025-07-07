import Tournament from "../model/tournament.js";
import Teams from "../model/teamsModel.js";
import Defaulttournament from "../model/defaulttournament.js";
import defaulttournament from "../model/defaulttournament.js";
import mongoose, { Types } from "mongoose";
import countryModel from "../model/countryModel.js";
import TournamentFormateModel from "../model/tournamentFormateModel.js";

export const addDefaulTournament = async (body) => {
  try {
    const defaultTournament = await Defaulttournament.create(body); // Create the team and return the created team object
    return defaultTournament;
  } catch (err) {
    console.error("Error in addTeams:", err);
    throw err;
  }
};

export const getDefaultTournamentService = async () => {
  try {
    const tournaments = await Defaulttournament.find().populate({
      path: "contry", // Path of the reference
      select: "name _id", // Only include 'name' and '_id'
    });
    console.log();

    return tournaments;
  } catch (error) {
    throw error;
  }
};
export const getDefaultTournamentServiceById = async (id) => {
  try {
    const tournaments = await Defaulttournament.findById(id);
    return tournaments;
  } catch (error) {
    throw error;
  }
};

const addTournamentService = async (tournamentData) => {
  try {
    let body = { ...tournamentData };
    console.log(body, "body");

    if (body.groups?.length) {
      body.groups = body.groups.map((g) => ({
        ...g,
        name: g.name.toUpperCase(),
      }));

      const names = body.groups.map((g) => g.name);
      if (new Set(names).size !== names.length) {
        throw new Error("Duplicate group names are not allowed.");
      }
    }

    const existTournament = await Tournament.findOne({ season: body.season });
    if (existTournament) {
      const error = new Error("This Tournament already exists.");
      error.statusCode = 404; // Set status code to 404
      throw error;
    }

    const findDefaultTournament = await defaulttournament.findById(
      body.tournamentId
    );
    body.name = findDefaultTournament.name;
    body.defaulttournamentID = body.tournamentId;
    body.hostCountry = findDefaultTournament.contry;
    console.log(findDefaultTournament, "findDefaultTournament");

    const tournament = new Tournament(body);
    await tournament.save(); // Save the tournament first

    // If there are teams in the tournament data, add them
    if (tournamentData.teams && tournamentData.teams.length > 0) {
      const createdTeams = await Promise.all(
        tournamentData.teams.map(async (teamData) => {
          const createdTeam = await addTeams(teamData);
          return {
            team: createdTeam._id,
            position: teamData.position,
            group: teamData.group?.toUpperCase(), // Convert group reference to uppercase,
            venue: teamData.venue,
          };
        })
      );

      tournament.teams = createdTeams;
      await tournament.save();
    }

    return tournament; // Return the created tournament with teams
  } catch (err) {
    console.error("Error in addTournamentService:", err);
    throw err; // rethrow to let controller handle the response
  }
};

export const addTeams = async (teamData) => {
  try {
    const createdTeams = []; // To store the successfully created teams

    // const countTeam=await Teams.findById()
    const tournament = await Tournament.findById(teamData.tournamentId);

    // Count the existing teams in the tournament
    const countTeam = await Teams.countDocuments({
      tournamentId: new Types.ObjectId(teamData.tournamentId),
    });

    // Check if the number of teams exceeds the allowed limit
    if (countTeam >= tournament.numberOfTeams) {
      throw new Error(
        `Cannot add more than ${tournament.numberOfTeams} teams to the tournament.`
      );
    }

    // Loop through each team in the payload
    for (const team of teamData.teams) {
      // Check if the team already exists in the tournament
      const existTeam = await Teams.findOne({
        tournamentId: new Types.ObjectId(teamData.tournamentId),
        shortName: team.shortName,
      });
      console.log("working");

      if (existTeam) {
        throw new Error(`This Team already exists in the tournament.`);
      }
      let randomTeamId =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      const obj = {
        tournamentId: teamData.tournamentId,
        fullName: team.fullName,
        shortName: team.shortName,
        teamId: randomTeamId,
        py_team_postion: team.py_team_postion,
        ty_team_postion: team.ty_team_postion,
        ty_team_result: team.ty_team_result,
        ty_team_result_position: team.ty_team_group_position,
        ty_team_group_position: team.ty_team_group_position,
        group: team.group,
        venue1: team.venue1,
        venue2: team.venue2,
        venue3: team.venue3,
        extraTeam: team.extraTeam,
      };

      // Create the team in the database
      const createdTeam = await Teams.create(obj);
      createdTeams.push(createdTeam);
    }
    return createdTeams;
  } catch (err) {
    console.error("Error in addTeams:", err);
    throw err;
  }
};

export const getTournamentService = async () => {
  try {
    const tournaments = await Tournament.find().populate("teams.team");
    return tournaments;
    
  } catch (error) {
    console.error("Error in getTournamentService:", error);
    throw error;
  }
};

export const getTeamService = async (tournamentId) => {
  try {
    let tournament;

    // Check if tournamentId is valid (not null or empty string)
    if (tournamentId && tournamentId !== "null" && tournamentId !== "") {
      tournament = await Teams.find({
        tournamentId: new mongoose.Types.ObjectId(tournamentId),
      });
    } else {
      // If tournamentId is invalid, fetch all tournaments (or handle as needed)
      tournament = await Teams.find();
    }

    return tournament; // Return the tournament or all tournaments
  } catch (error) {
    console.error("Error in getTournamentServiceById:", error);
    throw error; // Propagate error
  }
};


export const getTournamentServiceById = async (tournamentId) => {
  try {
    let tournament;

    // Check if tournamentId is valid (not null or empty string)
    if (tournamentId && tournamentId !== "null" && tournamentId !== "") {
      tournament = await Tournament.findById(tournamentId).populate(
        "teams.team"
      );
    } else {
      // If tournamentId is invalid, fetch all tournaments (or handle as needed)
      tournament = await Tournament.find().populate("teams.team");
    }

    return tournament; // Return the tournament or all tournaments
  } catch (error) {
    console.error("Error in getTournamentServiceById:", error);
    throw error; // Propagate error
  }
};

export const getTournamentServiceDefaultById = async (tournamentId) => {
  try {
    const tournament = await Tournament.find({
      defaulttournamentID: tournamentId,
    }).populate([
      {
        path: "hostCountry",
        select: "name _id", // fields from Country model
      },
      {
        path: "tournamentForMatType",
        select: "formateName _id", // fields from TournamentFormatType model
      },
    ]);
    console.log(tournament, "tournament");

    return tournament;
  } catch (error) {
    console.error("Error in getTournamentService:", error);
    throw error;
  }
};

export const getTournamentServiceName = async () => {
  try {
    // Fetch the tournament by ID and select only the desired fields
    const tournament = await Tournament.find();

    // Check if the tournament exists
    if (!tournament) {
      throw new Error("Tournament not found");
    }

    // Return the tournament data
    return {
      id: tournament._id,
      name: `${tournament.name}  ${tournament.season}`,
      season: tournament.season,
    };
  } catch (error) {
    console.error("Error in getTournamentServiceById:", error);
    throw error;
  }
};

export default addTournamentService;

export const updateDefaultTournamentService = async (id, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid tournament ID");
    }

    // Check if any tournament exists that was created before the new start year
    const conflictingTournament = await Tournament.findOne({
      defaulttournamentID: new Types.ObjectId(id),
      season: { $lt: updateData.startYear },
    });

    if (conflictingTournament) {
      throw new Error(
        `Cannot update. A tournament for this year already exists.`
      );
    }

    // Find tournament
    const findCountry = await countryModel.findOne({ name: updateData.contry });
    // console.log(findCountry,"findCountry")
    if (!findCountry) {
      const error = new Error(`Country "${updateData.contry}" not found.`);
      error.statusCode = 400;
      throw error;
    }

    // Assign ObjectId to updatedData
    updateData.contry = new Types.ObjectId(findCountry._id);
    // Proceed with update
    const updatedDefaultTournament = await defaulttournament.findByIdAndUpdate(
      id,
      {
        $set: {
          name: updateData.name,
          shortName: updateData.shortName,
          contry: updateData.contry,
          startYear: updateData.startYear,
        },
      },
      { new: true, runValidators: true }
    );

    return updatedDefaultTournament;
  } catch (error) {
    console.error("Error in updateTournamentService:", error.message);
    throw error;
  }
};


export const addCountryService = async (body) => {
  try {
    const country = await countryModel.create(body); // Create the team and return the created team object

    return country;
  } catch (err) {
    console.error("Error in addCountryService:", err);
    throw err;
  }
};

export const getCountryService = async () => {
  try {
    const data = await countryModel.find();
    return data;
  } catch (error) {
    console.error("Error in getTournamentService:", error);
    throw error;
  }
};

// services/country.service.js

export const updateCountryService = async (id, body) => {
  try {
    const updatedCountry = await countryModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCountry) {
      throw new Error("Country not found");
    }

    return updatedCountry;
  } catch (err) {
    console.error("Error in updateCountryService:", err);
    throw err;
  }
};

export const updateTournamentService = async (tournamentId, updatedData) => {
  try {
    // Check for duplicate group names if groups are being updated
    if (updatedData.groups?.length) {
      updatedData.groups = updatedData.groups?.map((g) => ({
        ...g,
        name: g.name.toUpperCase(),
      }));
      const names = updatedData.groups.map((g) => g.name);
      if (new Set(names).size !== names.length) {
        const error = new Error("Duplicate group names are not allowed.");
        error.statusCode = 400;
        throw error;
      }
    }

    // Find tournament
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      const error = new Error("Tournament not found.");
      error.statusCode = 404;
      throw error;
    }

    // Optional: prevent season update to existing one
    if (updatedData.season && updatedData.season !== tournament.season) {
      const seasonExists = await Tournament.findOne({
        season: updatedData.season,
      });
      if (seasonExists) {
        const error = new Error("Tournament with this season already exists.");
        error.statusCode = 409;
        throw error;
      }
    }

    // Merge updates
    Object.assign(tournament, updatedData);

    // Save updated tournament
    await tournament.save();
    return tournament;
  } catch (err) {
    console.error("Error in updateTournamentService:", err);
    throw err;
  }
};

export const updateTeamsService = async (id, teamData) => {
  try {
    console.log("Updating team with ID:", id);

    // Ensure the id is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid team ID");
    }

   
    const updatedTeam = await Teams.findByIdAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: teamData },
      { new: true } // Return the updated team document
    );

    // If the team was not found, throw an error
    if (!updatedTeam) {
      throw new Error("Team not found");
    }

    console.log("Updated team data:", updatedTeam);
    return updatedTeam;
  } catch (error) {
    console.error("Error updating team:", error.message);
    throw new Error(`Failed to update team: ${error.message}`);
  }
};

export const createTournamentFormateService = async (data) => {
  try {
    console.log("Creating tournament format");
    const tournamentFormat = new TournamentFormateModel(data);
    const tournamentFormatSave = await tournamentFormat.save();
    console.log("Tournament format created:", tournamentFormatSave);
    return tournamentFormatSave;
  } catch (error) {
    console.error("Error creating tournament format:", error.message);
    throw new error(`Failed to create tournament format: ${error.message}`);
  }
};

export const getTournamentFormateService = async () => {
  try {
    const data = await TournamentFormateModel.find();
    return data;
  } catch (error) {
    console.error("Error in getTournamentService:", error);
    throw error;
  }
};

export const updateTournamentFormateService = async (id, data) => {
  try {
    const updatedCountry = await TournamentFormateModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedCountry) {
      throw new Error("TournamentFormat not found");
    }

    return updatedCountry;
  } catch (err) {
    console.error("Error in TournamentFormat:", err);
    throw err;
  }
};
