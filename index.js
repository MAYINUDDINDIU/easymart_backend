const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfcq8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("productCollection").collection("product");

        // Create or Post new product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const addNewProducts = await productsCollection.insertOne(newProduct);
            res.send(addNewProducts);
        });

        // Read all product
        app.get('/product', async (req, res) => {
            const products = await productsCollection.find().toArray();
            res.send(products);
        });

        // Read only single product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query);
            res.send(product);
        });

        // Delete single product from all product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const deleteProduct = await productsCollection.deleteOne(query);
            res.send(deleteProduct);
        });
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Welcome Our Ecommerce Project Easymart')
})

app.listen(port, () => {
    console.log(`EasyMart listening on port ${port}`)
})