const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.xweyicz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const coffeesCollection = client.db('coffeesDB').collection('coffees')
        const usersCollection = client.db('coffeesDB').collection('users')

        app.get('/coffees', async (req, res) => {
            const cursor = coffeesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeesCollection.findOne(query)
            res.send(result)
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body
            console.log(newCoffee)
            const result = await coffeesCollection.insertOne(newCoffee)
            res.send(result)
        })

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: new ObjectId(id) }
            const coffee = req.body;
            const options = { upsert: true }
            const updateCoffee = {
                $set: {
                    name:coffee.name,
                    chef:coffee.chef,
                    supplier:coffee.supplier,
                    taste:coffee.taste,
                    category:coffee.taste,
                    details:coffee.details,
                    price:coffee.price,
                    photoUrl:coffee.photoUrl
                }
            }
            const result = await coffeesCollection.updateOne(filter,updateCoffee,options)
            res.send(result)
        })

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })

        //coffee store users apis

        app.get('/users', async(req,res)=>{
            const cursor = usersCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/users', async(req,res)=>{
            const user = req.body;
            console.log(user)
            const result = await usersCollection.insertOne(user)
            res.send(result)

        })

        app.patch('/users', async(req,res)=>{
            const user = req.body;
            const filter = {email:user.email}
            const updatedDoc = {
                $set:{
                    lastSignInTime:user.lastSignInTime
                }
            }
            const result =  await usersCollection.updateOne(filter,updatedDoc)
            res.send(result)
        })

        app.delete('/users/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('COFFEE STORE SERVER IN RUNNING')
})

app.listen(port, () => {
    console.log('PORT:', port)
})