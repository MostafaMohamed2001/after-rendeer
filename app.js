const express = require('express');
const dbConnection = require('./config/database');
const app = express();
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');

const viewRoutes = require("./routes/viewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cookie = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
//
app.use(express.json());
app.set('view engine', 'ejs')
//static files
app.use(express.static('public'))
// for delete
app.use(methodOverride('_method'))
//
app.use(cookie())
//for env
dotenv.config({ path: 'config.env' });
 
//Morgan
if (process.env.NODE_ENV === 'develpoment') {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
};
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  console.log("hello");
  

  console.log(req.cookies);             
  next()
});        
 
app.get('/render', (req, res) => { 
  res.send('Render')
});
app.use("/",viewRoutes)
app.use("/dashboard",dashboardRoutes);

app.use("/auth",authRoutes)
 
// unhandle route
 app.all('*', (req, res, next) => {
  
  if (process.env.NODE_ENV === 'develpoment') {
    next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
  } else {
    res.render('NotFound');
  }
  // next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));

}) 
// Global Error Midd
app.use(globalError);
  
//Connect With DB
dbConnection();
const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
}); 

//HANDEL REJECTION OUTSIDE EXPRESS
process.on('unhandledRejection', (err) => {
  console.error(`UnhandleRejection Errors: ${err} | ${err.message}`);
  server.close(() => {
    console.error(`Shuntting down ...`);
    process.exit(1);
  })
  
});  
 
