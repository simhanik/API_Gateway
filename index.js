const express = require('express')
const {PORT} = require('./src/config/serverConfig.js')
const app = express()


app.listen(PORT,() => {
    console.log(`Server started on Port : ${PORT}`);
    
})