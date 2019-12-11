// const conf = require('./config');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = `mongodb+srv://ordinary:vohFvCsItIaggn0m@mycluster-nrgaw.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let db
const connectDB = async () => {
    if(!client.isConnected()) {
       try{ 
           const connection =  await client.connect()
           db = connection.db("Access")
       } catch (e) {
           console.log(e.message)
       }
    }
}
const addUser = async(user) => {
    try {
        await connectDB()
        const result = await db.collection("users").insertOne(user, {
            w: "majority",
            wtimeout: 10000,
            serializeFunctions: false,
            forceServerObjectId: false,
            bypassDocumentValidation: false            
        })
        console.log(JSON.stringify(result))
        return result.ops[0]  
    } catch (e) {
        throw new Error("Insert operation is not successfull")
    }
}
const addUsers = async(users) => {
    try {
        await connectDB()
        const result = await db.collection("users").insertMany(users, {
            ordered: true
        })
        console.log(JSON.stringify(result))
        return result  
    } catch (e) {
        throw new Error("Insert operation is not successfull")
    }
}

const updateUser = async(query,update) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection("users").updateOne(query, {$set: update}, {
            upsert: false
        }) // findOneAndUpdate({id: user._d},user)
        console.log(JSON.stringify(result))
        return result  
    } catch (e) {
        throw new Error("Update operation is not successfull")
    }
}

const updateUsers = async(query,update) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection("users").updateMany(query, {$set: update}) 
        console.log(JSON.stringify(result))
        return result  
    } catch (e) {
        throw new Error("Update operation is not successfull")
    }
}

const removeUser = async (query) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection("users").deleteOne(query) 
        console.log(JSON.stringify(result)) 
        return result         
    } catch (e) {
        throw new Error("Delete operation is not successfull")
    }
}

const removeUsers = async (query) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection("users").deleteOne(query) 
        console.log(JSON.stringify(result))  
        return result        
    } catch (e) {
        throw new Error("Delete operation is not successfull")
    }
}

const findUsers = async (query) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection("users").find(query, {
            limit: 20
            // projection: {'name': 1, 'surname': 1},
            // skip: 20,
            // hint: {'_id': 1}
        }).toArray() 
        console.log(JSON.stringify(result))
        return result        
    } catch (e) {
        throw new Error("Delete operation is not successfull")
    }    
} 

module.exports = {
    addUser,
    addUsers,
    removeUser,
    removeUsers,
    updateUser,
    updateUsers,
    findUsers
}
