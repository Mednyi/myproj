var express = require('express');
var router = express.Router();
const uuid = require('uuid')
let users = require('../models/users')
let films = require('../models/films')
const jose = require('jose')
const {
  JWE,   // JSON Web Encryption (JWE)
  JWK,   // JSON Web Key (JWK)
  JWKS,  // JSON Web Key Set (JWKS)
  JWS,   // JSON Web Signature (JWS)
  JWT,   // JSON Web Token (JWT)
  errors // errors utilized by jose
} = jose
const key = JWK.asKey("HelloMyLilFriend")
/* GET users listing. */
router.post('/login', function(req, res, next) {
  const user = users.find(item => item.name === req.body.name)
  if(user && user.password === req.body.password) {
    const token = JWT.sign({
      iss: "ImCoder",
      sub: 'Auth',
      aud: user.id,
      iat: new Date(),
      ttype: 'access',
      header: {
        typ: "JWT",
        alg: "HS256"
      },
      jti: uuid() 
    },key, {
      expiresIn: "2m",
      algorithm: "HS256"
    })
    const refresh = JWT.sign({
      iss: "ImCoder",
      sub: 'Auth',
      ttype: 'refresh',
      iat: new Date(),
      aud: user.id,
      header: {
        typ: "JWT",
        alg: "HS256"
      },
      jti: uuid() 
    },key, {
      expiresIn: "5m",
      algorithm: "HS256"
    })
    res.send(JSON.stringify({token, refresh}))
  } else {
    res.status(401).send("Unauthorized")
  }
});
let auth = async (req, res, next) => {
  const user = users.find(item => item.id === req.params.id)
  const token = req.headers.authorization.split(' ')[1]
  try {
    user && JWT.verify(token, key, {
      algorithms: ["HS256"],
      issuer: "ImCoder",
      subject: "Auth",
      audience: req.params.id
    })
    next()
  } catch (e) {
    console.log(e.message)
    res.status(401).send("token is invalid") 
  }
}
router.use('/:id', auth)
router.post('/:id/refresh', function(req, res, next) {
  const token = JWT.sign({
    iss: "ImCoder",
    sub: 'Auth',
    aud: user.id,
    iat: new Date(),
    ttype: 'access',
    header: {
      typ: "JWT",
      alg: "HS256"
    },
    jti: uuid() 
  },key, {
    expiresIn: "2m",
    algorithm: "HS256"
  })
  const refresh = JWT.sign({
    iss: "ImCoder",
    sub: 'Auth',
    ttype: 'refresh',
    iat: new Date(),
    aud: user.id,
    header: {
      typ: "JWT",
      alg: "HS256"
    },
    jti: uuid() 
  },key, {
    expiresIn: "30m",
    algorithm: "HS256"
  })
  res.send(JSON.stringify({token, refresh}))
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
