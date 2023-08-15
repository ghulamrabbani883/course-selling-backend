const pg = require('pg')
require('dotenv').config()

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

pool.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log(`PostgresSQL Database connected`)
    }
})

module.exports = {pool}


