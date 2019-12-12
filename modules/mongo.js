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
const addOne = async(entity, col_name) => {
    try {
        await connectDB()
        const result = await db.collection(col_name).insertOne(entity, {
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
const addMany = async(entitys, col_name) => {
    try {
        await connectDB()
        const result = await db.collection(col_name).insertMany(entitys, {
            ordered: true
        })
        console.log(JSON.stringify(result))
        return result  
    } catch (e) {
        throw new Error("Insert operation is not successfull")
    }
}

const updateOne = async(query, update, col_name) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection(col_name).updateOne(query, {$set: update}, {
            upsert: false
        }) // findOneAndUpdate({id: user._d},user)
        console.log(JSON.stringify(result))
        return result  
    } catch (e) {
        throw new Error("Update operation is not successfull")
    }
}

const updateMany = async(query, update, col_name) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection(col_name).updateMany(query, {$set: update}) 
        console.log(JSON.stringify(result))
        return result  
    } catch (e) {
        throw new Error("Update operation is not successfull")
    }
}

const removeOne = async (query, col_name) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection(col_name).deleteOne(query) 
        console.log(JSON.stringify(result)) 
        return result         
    } catch (e) {
        throw new Error("Delete operation is not successfull")
    }
}

const removeMany = async (query, col_name) => {
    try {
        await connectDB()
        if(query._id) {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection(col_name).deleteOne(query) 
        console.log(JSON.stringify(result))  
        return result        
    } catch (e) {
        throw new Error("Delete operation is not successfull")
    }
}

const findEntities = async (query, col_name) => {
    try {
        await connectDB()
        if(query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        const result = await db.collection(col_name).find(query, {
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
    addOne,
    addMany,
    removeOne,
    removeMany,
    updateOne,
    updateMany,
    findEntities
}
