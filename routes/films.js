var express = require('express');
var router = express.Router();
const mongo = require('../modules/mongo')
/* GET films listing. */
const col_name = 'films'
router.get('/', async function(req, res, next) {
  try {
    const films = await mongo.findEntities({}, col_name)
    res.send(films)
  } catch (e) {
    res.status(500).send(e.message)
  }
});
router.post('/', async (req,res,next) => {
  try {
    let film = {
      title: req.body.title,
      tags: req.body.tags
    }
    film = await mongo.addOne(film, col_name)
    res.send(film)
  } catch (e) {
    res.status(500).send(e.message)
  }
  
})
router.delete('/:_id', async (req,res,next) => {
  try {
    await mongo.removeOne({_id : req.params._id}, col_name)
    res.send("film deleted")
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.put('/:_id', async (req,res,next) => {
  try {
    let updated = req.body
    const result = await mongo.updateOne({_id: req.params._id}, col_name)
    res.send(updated)
  } catch (e) {
    res.status(500).send(e.message)
  }
  
  res.send(updated)
})
router.get('/:_id', async function(req, res, next) {
  try {
    const result = await mongo.findEntities({_id: req.params_id}, col_name)
    res.send(JSON.stringify(result[0]));
    next()
  } catch (e) {
    res.status(500).send(e.message)
  }
});
module.exports = router;
