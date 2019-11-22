const uuid = require('uuid')

//JOSE Header
let JOSE = {
   typ: "JWT", // Тип токена 
   alg: "HS256" // Алгоритм шифрования 
}
//JWT Claim set
let Claim = {
    iss: "Рога и копыта", // Издатель
    sub: "authorization", // Тема
    aud: "John Smith",    // Аудиенция 
    exp: new Date().toISOString(), // Дедлайн
    nbf: new Date().toISOString(), // Момент, с которого токен становится валидным
    iat: new Date().toISOString(), // Время выдачи токена
    jti: uuid() // id токена
}
