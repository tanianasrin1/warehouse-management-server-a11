const express = require ('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpvu4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('oilService').collection('Inventory');
        
        app.get('/Inventory', async(req, res)=> {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/Inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        // post
        app.post('/Inventory', async(req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // DELETE
        app.delete('/Inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

        // update
        app.put('/Inventory/:id', async(req, res)=> {
            const id = req.params.id;
            const query ={_id:  ObjectId(id)};
            const product = req.body; 
            const {quantity, sold} = product;
            const updateDoc = {$set: {quantity, sold}};
            const option = {upsert: true};
            const result = await serviceCollection.updateOne(query, updateDoc, option );
            res.send (result);
                

        })
        

    }
    finally{

    }

}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running My Node Service')
});

app.listen(port, ()=> {
    console.log('Server is running', port)
})
