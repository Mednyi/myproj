var express = require('express');
var router = express.Router();
const uuid = require('uuid')
let users = require('../models/users')
let films = require('../models/films')
const auth = require('../modules/auth')
let mongo = require('../modules/mongo')
/* GET users listing. */
router.post('/login', async function(req, res, next) {
  try{
    let tokens = await auth.authorize(req.body.name, req.body.password)
    res.send(JSON.stringify(tokens))
  } catch (e) {
    res.status(401).send("Unauthorized")
  }
});
let authREST = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    await auth.checkAuth(token, req.params._id)
    next()
  } catch (e) {
    console.log(e.message)
    res.status(401).send("token is invalid") 
  }
}
router.use('/:_id', authREST)
router.post('/:_id/refresh', async function(req, res, next) {
  let tokens = await auth.authorize(req.body.name, req.body.password)
  res.send(JSON.stringify(tokens))
});
router.get('/', async function(req, res, next) {
  try {
    const users = await mongo.findUsers({})
    res.send(users);
  } catch (e) {
    res.status(500).send(e.message)
  } 
});
router.post('/', async (req,res,next) => {
  try {
    let user = {
      name: req.body.name,
      password: req.body.password
    }
    user = await mongo.addUser(user)
    res.send(user)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.delete('/:_id', async (req,res,next) => {
  try {
    await mongo.removeUser({_id: req.params._id})
    res.redirect("/").send("User deleted")
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.put('/:_id', async (req,res,next) => {
  try {
    let updated = req.body
    await mongo.updateUser({_id: req.params._id}, updated)
    res.send(updated)
  } catch (e) {
    res.status(500).send(e.message)
  }
})


router.post('/:id/films', (req,res) => {
  let bought = films.find(film => film.id===req.body.film)
  let buyer = users.find(user => user.id === req.params.id)
  buyer.films || (buyer.films = [])
  buyer.films.push(bought)
})
router.get('/:_id', async function(req, res, next) {
  try {
    const user = await mongo.findUsers({_id: req.params._id})[0]
    res.send(JSON.stringify(user));
    next()
  } catch (e) {
    res.status(500).send(e.message)
  }

});
module.exports = router;
