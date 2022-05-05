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
        const serviceCollection = client.db('oilService').collection('inventory');
        
        app.get('/inventory', async(req, res)=> {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
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
