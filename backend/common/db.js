
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import passwordHash  from 'bcrypt';
import User from '../model/usermodel.js';

const connectDB = async () => {
 return mongoose.connect(process.env.MONGO_URL||'mongodb://127.0.0.1:27017/cricket' )
 .then(async res=>{
    console.log("Connected to MongoDB");
    let isOwner = await User.countDocuments({ role: 1 });
    if (isOwner ===0){
        let userObj = {
            name : "Owner",
            userId : "owner",
            email : "yashkatara451@gmail.com",
            phone : "9548035336",
            password : await passwordHash.hash("123456", 10), // Hashing the password
            role : 1, // 1:Admin(OWNER)

        };

        await User.create(userObj)
        console.log("Owner created successfully");
    }
    
 }) 
 .catch(error => console.log("Error in DB connection:", error));
};
   export default connectDB;
//module.exports = connectDB;

