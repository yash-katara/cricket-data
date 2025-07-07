import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import connectDB from './common/db.js';
const port = 2000;
import cors from 'cors';
import router from './routes/index.route.js'
import userRouter from './routes/user.route.js';
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v2", router);

app.get('/', (req, res) => {
  res.send('App is Working');
});
// Connect to MongoDB
connectDB()

   
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
