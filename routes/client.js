var express = require('express');
var router = express.Router();
let mongo = require('../modules/mongo')
const col_name = 'clients'
router.get('/', async function(req, res, next) {
  try {
    const clients = await mongo.findEntities({}, col_name)
    res.send(clients);
  } catch (e) {
    res.status(500).send(e.message)
  } 
});
router.post('/', async (req,res,next) => {
  try {
    let client = {
      Name: req.body.name,
      Surname: req.body.surname,
      user: req.params._id
    }
    client = await mongo.addOne(client, col_name)
    res.send(client)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.delete('/:clientid', async (req,res,next) => {
  try {
    let result = await mongo.removeOne({_id: req.params.clientid}, col_name)
    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.put('/:clientid', async (req,res,next) => {
  try {
    let updated = req.body
    updated = await mongo.updateOne({_id: req.params.clientid}, updated, col_name)
    res.send(updated)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

router.get('/:clientid', async function(req, res, next) {
  try {
    const client = await mongo.findEntities({_id: req.params.clientid}, col_name)[0]
    res.send(JSON.stringify(client));
    next()
  } catch (e) {
    res.status(500).send(e.message)
  }

});
router.post('/:clientid/appointment', async (req,res,next) => {
  try {
    let appointment = {
      Doctor: req.body.doctor,
      Client: req.params.clientid,
      Date: new Date(req.body.date),
      Cab: req.body.cab,
      Diagnosis: "",
      Recoms: ""
    }
    let crossedApps = await mongo.findEntities({Date: {$gt: new Date(appointment.Date - 30*60*1000), $lt: new Date(appointment.Date + 30*60*1000)}}, 'appointments') 
    if(crossedApps.length === 0) {
      appointment = await mongo.addOne(appointment, 'appointments')
      res.send(appointment)
    } else {
      res.status(400).send("The time is already occupied")
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.delete('/:clientid/:appid', async (req,res,next) => {
  try {
    let result = await mongo.removeOne({_id: req.params.appid}, 'appointments')
    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
module.exports = router;
