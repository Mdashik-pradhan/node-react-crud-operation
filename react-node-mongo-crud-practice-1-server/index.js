const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://mydbuser1:HYf6nVmD5xSDUF8q@cluster0.hda5d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try{
         await client.connect();
         const database = client.db("sewingProducts");
         const productsCollection = database.collection("products");

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

        // POST API
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            console.log('Add a product', products)
            console.log(result);
            res.json(result);
        })

        // UPDATE API
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    productName: updatedProduct.productName,
                    price: updatedProduct.price,
                    quantity: updatedProduct.quantity
                },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // DELETE API

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log('Running server on ', port);
})