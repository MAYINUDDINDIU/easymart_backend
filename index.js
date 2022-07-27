const express = require('express')
const app = express()
const port = process.env.PORT || 5000;



app.get('/', (req, res) => {
    res.send('Welcome Our Ecommerce Project Easymart')
})

app.listen(port, () => {
    console.log(`EasyMart listening on port ${port}`)
})