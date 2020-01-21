var express = require('express');
var router = express.Router();
const auth = require('../modules/auth')
let mongo = require('../modules/mongo')
const ObjectId = require('mongodb').ObjectID;
/* GET users listing. */
const col_name = 'users'
const col_films = 'films'
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
    const users = await mongo.findEntities({}, col_name)
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
    user = await mongo.addOne(user, col_name)
    res.send(user)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.delete('/:_id', async (req,res,next) => {
  try {
    let result = await mongo.removeOne({_id: req.params._id}, col_name)
    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.put('/:_id', async (req,res,next) => {
  try {
    let updated = req.body
    updated = await mongo.updateOne({_id: req.params._id}, updated, col_name)
    res.send(updated)
  } catch (e) {
    res.status(500).send(e.message)
  }
})


/* router.post('/:_id/films', async (req,res) => {
  try {
    const users = await mongo.findEntities({_id: req.params._id}, col_name)
    users[0].value.films || (users[0].value.films = [])
    users[0].value.films.push(req.body._id)
    const result = await mongo.updateOne({_id: req.params._id}, users[0].value, col_name)
    res.send(result)
  } catch {
    res.status(500).send(e.message)
  }
})

router.get('/:_id/films', async (req,res) => {
  try {
    let users = await mongo.findEntities({_id: req.params._id}, col_name)
    const films = await mongo.findEntities({_id: {$in: users[0].value.films.map(id => new ObjectId(id))}}, col_films)
    res.send(films)
  } catch (e) {
    res.status(500).send(e.message)
  }
}) */

router.get('/:_id', async function(req, res, next) {
  try {
    const user = await mongo.findEntities({_id: req.params._id}, col_name)[0]
    res.send(JSON.stringify(user));
    next()
  } catch (e) {
    res.status(500).send(e.message)
  }

});
module.exports = router;
