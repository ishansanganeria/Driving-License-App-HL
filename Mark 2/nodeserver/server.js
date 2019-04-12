const express = require('express')
const cors = require('cors');
const app = express()
const fs = require('fs')
const supplements = require('./supplements.js')

app.use(cors());

app.route('/api/uid/:data')
  .get(async (req, res) => {
    let data = JSON.parse(req.params['data'])
    console.log(data);
    let response = await supplements.createUIDAI(data);
    console.log("response: " + response)
    res.json(response)
  });

supplements.fetchValues()
  .then(() => {
    supplements.readConnectionConfig()
  })
  .then(() => {
    app.listen(8000, () => {
      console.log('Server started!')
    })
  });