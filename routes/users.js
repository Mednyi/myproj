var express = require('express');
var router = express.Router();
const uuid = require('uuid')
let users = require('../models/users')
let films = require('../models/films')
const auth = require('../modules/auth')
/* GET users listing. */
router.post('/login', function(req, res, next) {
  try{
    let tokens = auth.authorize(req.body.name, req.body.password)
    res.send(JSON.stringify(tokens))
  } catch (e) {
    res.status(401).send("Unauthorized")
  }
});
let authREST = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    auth.checkAuth(token, req.params.id)
    next()
  } catch (e) {
    console.log(e.message)
    res.status(401).send("token is invalid") 
  }
}
router.use('/:id', authREST)
router.post('/:id/refresh', function(req, res, next) {
  let tokens = auth.authorize(req.body.name, req.body.password)
  res.send(JSON.stringify(tokens))
});
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
