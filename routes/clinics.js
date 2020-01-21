var express = require('express');
var router = express.Router();
let mongo = require('../modules/mongo')
const col_name = 'clinics'
router.get('/', async function(req, res, next) {
  try {
    let lat = parseFloat(req.query.lat)
    let long = parseFloat(req.query.long)
    let query = req.query.lat ? {
        location: {
            $near: {
                $geometry: {
                type: "Point" ,
                coordinates: [ lat , long ]
            },
            $maxDistance: 1000
        }
      }
    } : {}
    const clinics = await mongo.findEntities(query, col_name)
    res.send(clinics);
  } catch (e) {
    res.status(500).send(e.message)
  } 
});
router.post('/', async (req,res,next) => {
  try {
    let clinic = {
      name: req.body.name,
      location: req.body.location
    }
    clinic = await mongo.addOne(clinic, col_name)
    res.send(clinic)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.get('/:clinicid', async function(req, res, next) {
  try {
    const clinic = await mongo.findEntities({_id: req.params.clinicid}, col_name)[0]
    res.send(JSON.stringify(clinic));
    next()
  } catch (e) {
    res.status(500).send(e.message)
  }

});
module.exports = router;
