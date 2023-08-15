const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'})
const { adminRoute } = require('./routes/adminRoute');
const { userRoute } = require('./routes/userRoute');

const app = express();

const PORT = process.env.PORT

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        // "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
    });

    next();
});
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
app.use(express.json())
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
