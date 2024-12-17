import express  from 'express'
// const mongoose = require('mongoose')
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// App configuration
const app = express();
const PORT = process.env.PORT || 5000;
connectDB()
connectCloudinary()

// Middleware
app.use(cors());
app.use(express.json());


// api endpoint
app.use('/api/admin', adminRouter)

app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
  res.send('Hello from backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
