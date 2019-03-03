const express = require ('express');
const bodyParser = require ('body-parser');
const path = require('path');
const homeRouter = express.Router();

homeRouter.use(bodyParser.json());

//Serving static files
homeRouter.use(express.static(path.join(__dirname, '../public/HOME PAGE')));

homeRouter.get('/', (req, res, next) =>{
    res.sendFile(path.join(__dirname, '../public/HOME PAGE', 'test_score.html'));
    
})

module.exports = homeRouter;