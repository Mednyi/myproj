const uuid = require('uuid')
const jose = require('jose')
let users = require('../models/users')
const {
  JWK,   // JSON Web Key (JWK)
  JWT
} = jose
const key = JWK.asKey("HelloMyLilFriend")
const createToken = (id, ttype) => JWT.sign({
        iss: "ImCoder",
        sub: 'Auth',
        aud: id,
        iat: new Date(),
        ttype,
        header: {
          typ: "JWT",
          alg: "HS256"
        },
        jti: uuid() 
      },
      key, 
      {
        expiresIn: ttype === 'access' ? '2m' : '10m',
        algorithm: "HS256"
    }
)
const checkAuth = (token, id) => {
    const user = users.find(item => item.id === id)
    if(!user) throw new Error('no user')
    try {
      JWT.verify(token, key, {
        algorithms: ["HS256"],
        issuer: "ImCoder",
        subject: "Auth",
        audience: id
      })
    } catch (e) {
      console.log(e.message)
      throw new Error("Unauthorized") 
    }  
}
const authorize = (name, password) => {
    const user = users.find(item => item.name === name)
    if(user && user.password === password) {
      const token = createToken(user.id, 'access')
      const refresh = createToken(user.id, 'refresh')
      return {token, refresh}
    } else {
      throw new Error("Unauthorized")
    }
}
module.exports = {
    createToken,
    checkAuth,
    authorize
}