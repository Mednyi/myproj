// const conf = require('./config');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const uri = `mongodb+srv://ordinary:D1fOmvXwRBG8MRw9@cluster0-gaj0e.mongodb.net/test?retryWrites=true&w=majority`;
const rfc6902 = require('rfc6902')
const client = new MongoClient(uri, { useNewUrlParser: true });
var streamOpsMAp = {
    insert: 'add',
    delete: 'remove',
    update: 'add',
    replace: 'add'
}
let changeStream
const constructStreamPatch = data => {
    var path =  '/' + data.documentKey._id
    var op = streamOpsMAp[data.operationType]
    var value
    var patch = []
    if (data.operationType === 'insert' || data.operationType === 'replace' || data.operationType === 'delete') { 
      value = data.fullDocument
      patch = [{
        op,
        path,
        value
      }]
    } else if(data.operationType ==='update') {
      patch = Object.entries(data.updateDescription.updatedFields).map(field => {
        return {
          op,
          path: '/' + data.documentKey._id + '/' + field[0],
          value: field[1]
        }
      })
    }
    return {
      type: data.ns.coll,
      patch
    }
}
const connectDB = async () => {
    if(!client.isConnected()) {
       try{ 
           const connection =  await client.connect()
           db = connection.db("Access")
           db.collection("clinics").createIndex( { location : "2dsphere" } )
           changeStream = db.watch()
       } catch (e) {
           console.log(e.message)
       }
    }
}
const initStream = async (io) => {
    try {
        await connectDB()
        changeStream.on('change', next => {
           io.emit('message', constructStreamPatch(next))
        })
    } catch(e) {
        throw e
    }
}

const constructPatch = (op, docs) => {
    if(op === 'remove') {
        return [{
            op,
            path: '/' + docs[0]._id
        }]
    }
    var patch = docs.map(doc => {
      return {
        op,
        path: '/' + doc._id,
        value: doc
      }
    })
    return patch
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
        return constructPatch('add', result)       
    } catch (e) {
        throw new Error("Delete operation is not successfull")
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
        assert.equal(result.insertedCount, 1)
        return constructPatch('add', result.ops)  
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
        assert.equal(result.insertedCount, enitys.length)
        return constructPatch('add', result.ops)  
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
        assert.equal(result.matchedCount, 1)
        assert.equal(result.modifiedCount, 1)
        console.log(JSON.stringify(result))
        const updated = await findEntities(query, col_name)
        return updated
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
        const updated = await findEntities(query, col_name)
        return updated 
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
        assert.equal(result.deletedCount, 1)
        return constructPatch('remove', {query})        
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
        return constructPatch('remove', {query})          
    } catch (e) {
        throw new Error("Delete operation is not successfull")
    }
}

const findAndGroup = async (groupFiled, col_name) => {
    try {
        await connectDB()
        let field = '$' + groupFiled
        const result = await db.collection(col_name).aggregate([
            {$group: {_id  : null, passwords: {$addToSet: "$password"}}}
        ]).toArray()
        return result
    } catch (e) {
        throw e
    }
}

const DBopMap = {
    add: addOne,
    remove: removeOne,
    replace: updateOne
} 
const applyPatches = async (patches, col_name) => {
    try {
        let result
        // [{op: 'add', path: '/134345345', value: {name: "username", surname: 'surname'}}]
        // [{op: 'remove', path: '/134345345'}]
        // [{op: 'replace', path: '/134345345/name/bee', value: "username"}]
        const patch = patches[0]
        let address = patch.path.split('/')
        switch (patches[0].op) {
            case 'add':
                result =  await addOne(patch.value, col_name)
                break;
            case 'remove': 
                result = await removeOne({_id: address[1]}, col_name)
                break;
            case 'replace':
                let update = {}
                let result = address.reduce((acc, addr, index) => {
                    acc = acc || update
                    if(index !== 0) {
                        if(isNaN(address[index+1]) && (index+1) < address.length) {
                            acc[addr] = {}   
                        } else if ((index+1) < address.length) {
                            acc[addr] = []
                        } else {
                            acc[addr] = value
                        }
                    }    
                    return acc[addr]  
                }, { })                
                result = await updateOne({_id: address[1]}, update, col_name) 
                break;
        }
        return result
    } catch (e) {
        throw e
    }
}

module.exports = {
    addOne,
    addMany,
    removeOne,
    removeMany,
    updateOne,
    updateMany,
    findEntities,
    changeStream,
    connectDB,
    constructStreamPatch,
    initStream,
    findAndGroup
}
