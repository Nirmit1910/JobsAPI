require('dotenv').config();
require('express-async-errors');

//extra security
const helmet = require('helmet');
const cors= require('cors');
const xss= require('xss-clean');
const rateLimit = require('express-rate-limit');



const express = require('express');
const app = express();

//connnectDB
const connectBD= require('./db/connect');

const authenticateUser = require('./middleware/authentication.js');

//routers
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');





// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');




// extra packages
app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.get('/',(req,res)=>{
  res.send('Jobs API');
})
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectBD(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
