import { addUserService, changePassword, getUsersService, loginService, updateUserService } from '../services/userService.js'; // assuming you have this service
import UserModel from '../model/usermodel.js'; // assuming you have a User model defined
import { authMiddleware } from '../middleware/authMiddleware.js';
export const loginUser = async (req, res) => {
  try {    
    const { userId, password } = req.body;
    const response = await loginService(userId, password);
    console.log(response, "response from login service");
    

    return res.json(response);

  } catch (err) {
    console.error(err);

    const status = err.statusCode ? err.statusCode : 500; 
    return res.status(status).json({ message: err.message });
  }
};


export const addUserController = async (req, res) => {
  try {    
    const response = await addUserService(req.body);

    return res.json(response);

  } catch (err) {
    console.error(err);

    const status = err.statusCode ? err.statusCode : 500; 
    return res.status(status).json({ message: err.message });
  }
};

export const getUserController = async (req, res) => {
  try {    
    // const response = await getUsersService(req.query.role);
    const userDetails=await UserModel.find({})
    if(!userDetails || userDetails.length === 0){
      const error = new Error("No users found");
    return res.json(response);
  }
    return res.json(userDetails);
 } catch (err) {
    console.error(err);

    const status = err.statusCode ? err.statusCode : 500; 
    return res.status(status).json({ message: err.message });
  }
};


export const updateUserController = async (req, res) => {
  try {    
    const response = await updateUserService(req.params.id,req.body);

    return res.json(response);

  } catch (err) {
    console.error(err);

    const status = err.statusCode ? err.statusCode : 500; 
    return res.status(status).json({ message: err.message });
  }
};


export const changePasswordController = async (req, res) => {
  try {    
    
    const response = await changePassword(req.body);

    return res.json(response);

  } catch (err) {
    console.error(err);

    const status = err.statusCode ? err.statusCode : 500; 
    return res.status(status).json({ message: err.message });
  }
};