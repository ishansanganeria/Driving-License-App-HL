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

app.route('/api/uidai/fetchData/:uid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let response = await supplements.fetchDataUidaiToCommonChannel(uid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/fetchDataPart1/:uid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let response = await supplements.fetchDataUidaiFromCommonChannel(uid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/fetchDataPart2/:uid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let response = await supplements.fetchDataUidaiFromDlChannel(uid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/addRto/:data')
  .get(async (req, res) => {
    let data = req.params['data']
    console.log(data);
    let response = await supplements.addRto(data);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

  app.route('/api/dl/addOfficer/:uid/:rtoid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let rtoid = req.params['rtoid']
    let response = await supplements.addOfficer(uid,rtoid);
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