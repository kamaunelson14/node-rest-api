//load environmental variables on dev environment
process.env.NODE_ENV !== 'production' && require('dotenv').config();

//Load dependencies
const   express     = require('express'),
        app         = express(),
        {errorHandler} = require('./middleware/errorMiddleware'),
        connectDB = require('./config/db');

//Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//import routes
app.use('/api/contacts/', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

//custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, process.env.IP, _=> {
    console.log(`Server is running on Port ${PORT}`);
});