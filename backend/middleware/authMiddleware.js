// import jsonwebtoken from 'jsonwebtoken';

// export const authMiddleware = (req, res, next) => {
//     try{
//         //const token = req.header('Authorization')?.replace('Bearer ', '').trim();
//          const token = req.header('Authorization')?.replace('Bearer ', '');

//         console.log("Token received:", token);
//         if (!token) {
//             return res.status(401).json({ message: "Access Denied: No Token Provided" });
//         }
//       jsonwebtoken.verify(token,process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 console.error("Token verification error:", err);
//                 return res.status(401).json({ message: "Invalid or expired Token" });
//             }
//             req.user = decoded; // Attach the decoded user info to the request object
//             next(); 
//         }   
//         );



        

    

//     }catch(error){
//         console.error("Error in authMiddleware:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

import jwt from 'jsonwebtoken'; // Importing jsonwebtoken for token verification

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1]; 
  console.log("Token received:", token);
  
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // store user info in request
    next(); // allow access
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

//module.exports = {authMiddleware};