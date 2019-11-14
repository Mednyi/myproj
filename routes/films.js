var express = require('express');
var router = express.Router();
const uuid = require('uuid')
let films = require('../models/films')
/* GET films listing. */
router.get('/', function(req, res, next) {
  res.send(films);
});
router.post('/', (req,res,next) => {
  let film = {
    id: uuid(),
    title: req.body.title,
    tags: req.body.tags
  }
  films.push(film)
  res.send(film)
})
router.delete('/:id', (req,res,next) => {
  films = films.filter(film => film.id !== req.params.id)
  res.redirect("/").send("film deleted")
})
router.put('/:id', (req,res,next) => {
  let updated = req.body
  updated = req.params.id
  films = films.filter(film => film.id !== req.params.id)
  films.push(updated)
  res.send(updated)
})
router.get('/:id', function(req, res, next) {
  const film = films.find(item => item.id === req.params.id)
  res.send(JSON.stringify(film));
  next()
});
module.exports = router;
