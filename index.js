const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfcq8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const productsCollection = client
            .db("productCollection")
            .collection("product");
        const addToCartCollection = client
            .db("productCollection")
            .collection("addToCart");
        const userCollection = client.db("productCollection").collection("user");

        // Create or Post new product
        app.post("/product", async (req, res) => {
            const newProduct = req.body;
            const addNewProducts = await productsCollection.insertOne(newProduct);
            res.send(addNewProducts);
        });

        // Read all product
        app.get("/product", async (req, res) => {
            const products = await productsCollection.find().toArray();
            res.send(products);
        });

        // Read all Men product
        app.get("/MenProduct", async (req, res) => {
            const pdct = req.body;
            const query = { women: pdct.women, kids: pdct.kids };
            if (query) {
                const cursor = productsCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
        });

        // Read all Womens product
        app.get("/WomenProduct", async (req, res) => {
            const pdct = req.body;
            const query = { men: pdct.men, kids: pdct.kids };
            if (query) {
                const cursor = productsCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
        });

        // Read all Kids product
        app.get("/kidProduct", async (req, res) => {
            const pdct = req.body;
            const query = { men: pdct.men, women: pdct.women };
            if (query) {
                const cursor = productsCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
        });

        // Read only single product
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        });

        // Delete single product from all product
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteProduct = await productsCollection.deleteOne(query);
            res.send(deleteProduct);
        });

        app.put("/product/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: data.name,
                    price: data.price,
                    quantity: data.quantity,
                    img: data.img,
                },
            };
            const result = await productsCollection.updateOne(
                filter,
                updatedDoc,
                options
            );
            res.send(result);
        });

        // Add To Cart
        app.post("/addtocart", async (req, res) => {
            const addToCart = req.body;
            const query = { name: addToCart.name };
            const exists = await addToCartCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, purchae: exists });
            }
            const add = await addToCartCollection.insertOne(addToCart);
            return res.send({ success: true, add });
        });

        // Read all Cart Data
        app.get("/addtocart", async (req, res) => {
            const cartData = await addToCartCollection.find().toArray();
            res.send(cartData);
        });

        // Read only single product
        app.get("/addtocart/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const product = await addToCartCollection.findOne(query);
            res.send(product);
        });

        // delete cart data
        app.delete("/deleteCart/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const deleteCartData = await addToCartCollection.deleteOne(query);
            res.send(deleteCartData);
        });
        //Updating Users Registration Information
        app.put("/user/:email", async (req, res) => {
            const email = req.params.email;

            const user = req.body;
            console.log(email, user);
            const filter = { email: email };
            const option = { upsert: true };

            const updatedDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updatedDoc, option);

            res.send(result);
        });
        //Getting all users
        app.get("/users", async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });
    } finally {
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Welcome Our Ecommerce Project Easymart");
});

app.listen(port, () => {
    console.log(`EasyMart listening on port ${port}`);
});
