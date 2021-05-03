const path=require('path')
const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const colors=require('colors');
const fileupload=require('express-fileupload');
const cookieParser=require('cookie-parser');
const helmet=require('helmet');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const mongoSanitize=require('express-mongo-sanitize');
const errorHandler=require('./middleware/error')
const connectDB=require('./config/db')
//LOAD ENV Vars
dotenv.config({path:'./config/config.env'});

//Connect to DB
connectDB();
//Route files
const bootcamps=require('./routes/bootcamps')
const courses=require('./routes/courses')
const auth=require('./routes/auth')
const users=require('./routes/users')
const reviews=require('./routes/reviews')



const app=express();
app.use(express.json())
app.use(cookieParser());
//Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//File upload
app.use(fileupload());

//sanitizer data
app.use(mongoSanitize())

//prevent CSS attacked
app.use(xss())

//Rate limiting
const limiter=rateLimit({
    windowMs:10 * 60 * 1000,//10 mins
    max:1
});
app.use(limiter);
//Prevent http params pollution
app.use(hpp())

//Enable cors
app.use(cors());

//Set security header
app.use(helmet())

//Set static folder
app.use(express.static(path.join(__dirname,'public')))

//Mount routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews);

app.use(errorHandler)
const PORT=process.env.PORT || 5000;

const server= app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//Handle unhanlde rejection
process.on('unhandle rejection',(err, promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server and exit process
    server.close(()=>process.exit(1))
})