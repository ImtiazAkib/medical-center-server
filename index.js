const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//Middleware
app.use(cors());
app.use(express.json());

//Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tsciz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
    await client.connect();
    const database = client.db("inventory");
    const productsCollection = database.collection("tools");
    const usersCollection = database.collection("users");
    const purchaseCollection = database.collection("purchase");
    
    // GET DATA
    app.get('/tools',async(req,res)=>{
        const cursor = productsCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // GET DATA
    app.get('/orders',async(req,res)=>{
        const cursor = purchaseCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // GET DATA
    app.get('/reviews',async(req,res)=>{
        const database = client.db("myReviews");
        const productsCollection = database.collection("reviews");
        const cursor = productsCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // GET Single DATA
    app.get('/purchase/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const product = await productsCollection.findOne(query);
        res.send(product);
    })


    // Update
    app.put('/user/:email', async(req,res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email:email};
        const options = { upsert: true };
        const updateDoc = {
            $set: user
          };
          const result = await usersCollection.updateOne(filter, updateDoc, options);
          res.send(result);
    })

    // Update
    app.put('/users/:email', async(req,res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email:email};
        const options = { upsert: true };
        const updateDoc = {
            $set: user
          };
          const result = await usersCollection.updateOne(filter, updateDoc, options);
          res.send(result);
    })

    // Update
    app.put('/user/update/:email', async(req,res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email:email};
        const options = { upsert: true };
        const updateDoc = {
            $set: user
          };
          const result = await usersCollection.updateOne(filter, updateDoc, options);
          res.send(result);
    })

    // GET DATA
    app.get('/users',async(req,res)=>{
        const cursor = usersCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    //Add Review
    app.post('/reviews', async(req,res)=>{
        const database = client.db("myReviews");
        const productsCollection = database.collection("reviews");
        const review = req.body;
        const doc ={
            rating:review.rating,
            description:review.description    
        }
        const result = await productsCollection.insertOne(doc);
        res.send(result);
    })

    //Add Product
    app.post('/tools', async(req,res)=>{
        const tool = req.body;
        const doc ={
        name:tool.name,
        description:tool.description,
        img:tool.img,
        minimumQuantity:tool.minQuantity,
        availableQuantity:tool.availableQuantity,
        price:tool.price,   
        }
        const result = await productsCollection.insertOne(doc);
        res.send(result);
    })

    //Add Purchase
    app.post('/purchase', async(req,res)=>{
        const purchase = req.body;
        const doc ={ 
                name:purchase.name,
                order:purchase.order,
                email:purchase.email,
                price:purchase.price,
                id:purchase.id,
                img:purchase.img,
                user:purchase.name,
                contact:purchase.contact,
                address:purchase.address
         }
        const result = await purchaseCollection.insertOne(doc);
        res.send(result);
    })

    //Delete Product
    app.delete('/delete/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const result = await purchaseCollection.deleteOne(query);
        res.send(result);
    })

    //Delete User
    app.delete('/user/delete/:email', async(req,res)=>{
        const email = req.params.email;
        const query = { email:email };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    })

    }
    finally{
    // await client.close();
    }
}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('Hello World!!!')
})

app.listen(port,()=>{
    console.log('Listening to port',port)
})