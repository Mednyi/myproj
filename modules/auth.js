const uuid = require('uuid')
const jose = require('jose')
let mongo = require('./mongo')
const {
  JWK,   // JSON Web Key (JWK)
  JWT
} = jose
const key = JWK.asKey("HelloMyLilFriend")
const createToken = async (id, ttype) => JWT.sign({
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
const checkAuth = async (token, id) => {
    try {
      const user = await mongo.findUsers({_id: id})
      if(!user[0]) throw new Error('no user')
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
const authorize = async (name, password) => {
    try {
      const users = await mongo.findUsers({name, password})
      const token = await createToken(users[0]._id.toString(), 'access')
      const refresh = await createToken(users[0]._id.toString(), 'refresh')
      return {token, refresh}
    } catch (e) {
      throw e
    }
}
module.exports = {
    createToken,
    checkAuth,
    authorize
}