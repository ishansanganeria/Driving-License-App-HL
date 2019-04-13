const express = require('express')
const cors = require('cors');
const app = express()
const fs = require('fs')
const supplements = require('./supplements.js')

app.use(cors());

app.route('/api/uidai/part1/:data')
  .get(async (req, res) => {
    let data = JSON.parse(req.params['data'])
    console.log(data);
    let response = await supplements.createUIDAI(data);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/uidai/part2/:uid/:data')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let data = JSON.parse(req.params['data'])
    let response = await supplements.createUIDAI2(uid, data);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/uidai/part3/:uid/:data')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let data = JSON.parse(req.params['data'])
    console.log(uid, req.params['data']);
    console.log(data);
    let response = await supplements.createUIDAI3(uid, data);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

supplements.fetchValues()
  .then(() => {
    supplements.readConnectionConfig()
  })
  .then(() => {
    app.listen(8000, () => {
      console.log('\nServer started!')
    })
  });