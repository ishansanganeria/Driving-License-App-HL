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

app.route('/api/dl/checkIfHaveData/:uid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let response = await supplements.checkIfHaveData(uid);
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
    let response = await supplements.addOfficer(uid, rtoid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/applyLicense/:uid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let response = await supplements.applyLicnese(uid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/fetchStatus/:uid/:filenumber')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let filenumber = req.params['filenumber']
    let response = await supplements.ReturnStatus(uid, filenumber);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/fetchOfficerDetails/:offid')
  .get(async (req, res) => {
    let offid = req.params['offid']
    let response = await supplements.fetchOfficerDetails(offid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/fetchScoresToBeAdded/:rtoid')
  .get(async (req, res) => {
    let rtoid = req.params['rtoid']
    let response = await supplements.fetchScoresToBeAdded(rtoid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/addScore/:uid/:testtype/:score/:officerid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let testtype = req.params['testtype']
    let score = req.params['score']
    let officerid = req.params['officerid']
    let response = await supplements.addScore(uid, testtype, score, officerid);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/addTicket/:uid/:officerid/:reason/:place/:amount')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let officerid = req.params['officerid']
    let reason = req.params['reason']
    let place = req.params['place']
    let amount = req.params['amount']
    let response = await supplements.addTicket(uid, officerid, reason, place, amount);
    console.log("response: " + JSON.stringify(response))
    res.json(response)
  });

app.route('/api/dl/payFine/:uid/:ticketid')
  .get(async (req, res) => {
    let uid = req.params['uid']
    let ticketid = req.params['ticketid']
    let response = await supplements.payFine(uid, ticketid);
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