import matchService, { getMatchesService, updateMatchService } from '../services/matchService.js';  // Import the service

 
export const createMatchController = async (req, res) => {
  try {
    const matchData = req.body;  
    const match = await matchService(matchData);  
    res.status(201).json({ success: true, match }); 
  } catch (err) {
    console.error('Error in createMatchController:', err);
    res.status(400).json({ success: false, message: err.message }); 
  }
};


export const getMatchesController = async (req, res) => {
    try {
      console.log("req.query.tournamentId",req.query.tournamentId);
      
      const result = await getMatchesService(req.query.tournamentId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };


  export const updateMatchController = async (req, res) => {
    try {
      console.log("req.query.tournamentId",req.query.tournamentId);
      
      const result = await updateMatchService(req.query.tournamentId,req.body);
      res.status(200).json(
        { success: true,
         data: result
         }
        );
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };