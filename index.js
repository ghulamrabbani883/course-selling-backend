const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'})
const { adminRoute } = require('./routes/adminRoute');
const { userRoute } = require('./routes/userRoute');

const app = express();

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send('hello world from courseSelling app')
})
app.use('/admin',adminRoute);
app.use('/user',userRoute);





app.listen(PORT, ()=>{
    console.log(`server is running at ${PORT}`)
})