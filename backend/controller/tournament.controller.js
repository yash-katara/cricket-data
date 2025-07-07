// const { addTournamentService } = require('../services/tournamentService');
import addTournamentService, { addCountryService, addDefaulTournament, addTeams, createTournamentFormateService, getCountryService, getDefaultTournamentService, getTeamService, getTournamentFormateService, getTournamentService, getTournamentServiceById, getTournamentServiceDefaultById, getTournamentServiceName, updateCountryService, updateDefaultTournamentService, updateTeamsService, updateTournamentFormateService, updateTournamentService } from "../services/tournamentService.js"

export const addDefaultTournament = async (req, res) => {
  try {
    const tournament = await addDefaulTournament(req.body);
    return res.status(201).json({
      message: 'Tournament created successfully',
      data: tournament,
    });
  } catch (err) {
    console.error('Error in addTournament controller:', err);
    return res.status(500).json({
      message: err.message || 'Something went wrong',
    });
  }
};


export const addCountryController = async (req, res) => {
  try {
    const country = await addCountryService(req.body);
    return res.status(201).json({
      message: 'Created successfully',
      data: country,
    });
  } catch (err) {
    console.error('Error in addTournament controller:', err);
    return res.status(500).json({
      message: err.message || 'Something went wrong',
    });
  }
};


export const addTournament = async (req, res) => {
  try {
    const tournament = await addTournamentService(req.body);
    return res.status(201).json({
      message: 'Tournament created successfully',
      data: tournament,
    });
  } catch (err) {
    console.error('Error in addTournament controller:', err);
    return res.status(500).json({
      message: err.message || 'Something went wrong',
    });
  }
};


export const addTeamController = async (req, res) => {
  try {
    const tournament = await addTeams(req.body);
    return res.status(201).json({
      message: 'Team created successfully',
      data: tournament,
    });
  } catch (err) {
    console.error('Error in addTournament controller:', err);
    return res.status(500).json({
      message: err.message || 'Something went wrong',
    });
  }
};

export const getTeamByTournament = async (req, res) => {
  try {
    const result = await getTeamService(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTournamentController = async (req, res) => {
    try {
      const result = await getTournamentService();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  export const getDefaultTournamentController = async (req, res) => {
    try {
      const result = await getDefaultTournamentService();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  export const getDefaultTournamentControllerbyId = async (req, res) => {
    try {
      const result = await getDefaultTournamentControllerbyId(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };



  export const getTournamentControllerById = async (req, res) => {
    try {
      const result = await getTournamentServiceById(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  export const getTournamentControllerDefaultById = async (req, res) => {
    try {
      const result = await getTournamentServiceDefaultById(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };


  export const getTournamentControllerName = async (req, res) => {
    try {
      const result = await getTournamentServiceName();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };


  export const updateDefaultTournament = async (req, res) => {
    try {
      const { id } = req.params; 
      const updatedData = await updateDefaultTournamentService(id, req.body);
      
      if (!updatedData) {
        return res.status(404).json({ success: false, message: `Tournament not found` });
      }
  
      res.status(200).json({
        success: true,
        message: `Existing data updated successfully`,
        data: updatedData
      });
    } catch (error) {
      console.error("Error in updateTournamentController:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };



  export const getCountry = async (req, res) => {
    try {
      const result = await getCountryService();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  
  export const updateTournamentController = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    try {
      const updatedTournament = await updateTournamentService(id, updatedData);
      res.status(200).json({
        message: "Tournament updated successfully",
        data: updatedTournament
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        error: err.message || "Internal server error"
      });
    }
  };



  
export const updateTeamsController = async (req, res) => {
  try {
    const teamData = req.body;
    

    // if (!teamData.teams || !Array.isArray(teamData.teams)) {
    //   return res.status(400).json({ message: "Invalid or missing 'teams' array." });
    // }
    console.log(teamData,"teamData==========");
    

    const updated = await updateTeamsService(req.params.id,teamData);

    res.status(200).json({
      message: "Teams updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating teams",
      error: err.message
    });
  }
}




export const updateCountryController = async (req, res) => {
  const countryId = req.params.id;
  const updateData = req.body;

  try {
    const result = await updateCountryService(countryId, updateData);
    res.status(200).json({
      success: true,
      message: 'Country updated successfully',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update country'
    });
  }
};



  export const createTournamentFormateController = async (req, res) => {
    try {
      const result = await createTournamentFormateService(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
   export const getTournamentFormateController = async (req, res) => {
    try {
      const result = await getTournamentFormateService(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  export const updateTournamentFormateController = async (req, res) => {
    try {

      const result = await updateTournamentFormateService(req.params.id,req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };