const express = require('express')
const cors = require("cors");
const app = express()
const port = process.env.PORT || 5000;
require("dotenv").config();
const jwt = require("jsonwebtoken");
//Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome Our Ecommerce Project Easymart')
})

app.listen(port, () => {
    console.log(`EasyMart listening on port ${port}`)
})