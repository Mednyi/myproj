var express = require('express');
var router = express.Router();
const uuid = require('uuid')
let users = require('../models/users')
let films = require('../models/films')
/* GET users listing. */
router.post('/login', function(req, res, next) {
  const user = users.find(item => item.name === req.body.name)
  if(user && user.password === req.body.password) {
    user.token = uuid()
    user.exp = new Date()
    user.exp.setMinutes(user.exp.getMinutes() + 120)
    res.send(user.token);
  } else {
    res.status(401).send("Unauthorized")
  }
});
let auth = async (req, res, next) => {
  const user = users.find(item => item.id === req.params.id)
  if(user && req.body.token === user.token && new Date() < user.exp) {
    next()
  } else {
    delete user.token
    res.status(401).send() 
  }
}
router.use('/:id', auth)
router.get('/', function(req, res, next) {
  res.send(users);
});
router.post('/', (req,res,next) => {
  let user = {
    id: uuid(),
    name: req.body.name,
    password: req.body.password
  }
  users.push(user)
  res.send(user)
})
router.delete('/:id', (req,res,next) => {
  users = users.filter(user => user.id !== req.params.id)
  res.redirect("/").send("User deleted")
})
router.put('/:id', (req,res,next) => {
  let updated = req.body
  updated = req.params.id
  users = users.filter(user => user.id !== req.params.id)
  users.push(updated)
  res.send(updated)
})


router.post('/:id/films', (req,res) => {
  let bought = films.find(film => film.id===req.body.film)
  let buyer = users.find(user => user.id === req.params.id)
  buyer.films || (buyer.films = [])
  buyer.films.push(bought)
})
router.get('/:id', function(req, res, next) {
  const user = users.find(item => item.id === req.params.id)
  res.send(JSON.stringify(user));
  next()
});
module.exports = router;
