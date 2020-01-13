var express = require('express');
var router = express.Router();
let mongo = require('../modules/mongo')
const col_name = 'appointments'
router.get('/', async function(req, res, next) {
  try {
    const appointments = await mongo.findEntities({}, col_name)
    res.send(appointments);
  } catch (e) {
    res.status(500).send(e.message)
  } 
});
router.post('/', async (req,res,next) => {
  try {
    let appointment = {
      Name: req.body.name,
      Surname: req.body.surname,
      user: req.params._id,
      cab: req.body.cab,
      schedule: req.body.schedule,
      spec: req.body.spec
    }
    doctor = await mongo.addOne(doctor, col_name)
    res.send(doctor)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.delete('/:doctorid', async (req,res,next) => {
  try {
    let result = await mongo.removeOne({_id: req.params.doctorid}, col_name)
    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.put('/:doctorid', async (req,res,next) => {
  try {
    let updated = req.body
    updated = await mongo.updateOne({_id: req.params.doctorid}, updated, col_name)
    res.send(updated)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

router.get('/:doctorid', async function(req, res, next) {
  try {
    const doctor = await mongo.findEntities({_id: req.params.doctorid}, col_name)[0]
    res.send(JSON.stringify(doctor));
    next()
  } catch (e) {
    res.status(500).send(e.message)
  }

});
module.exports = router;
