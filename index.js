const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const productRouter = require("./routes/product.route");
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
    const reviewCollection = client
      .db("productCollection")
      .collection("reviews");
    const orderCollection = client.db("productCollection").collection("orders");

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
          offer: data.offer,
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
      const query = { _id: ObjectId(id) };
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
    //Updating cart product amount
    app.put("/increase/:id", async (req, res) => {
      const productId = req.params.id;
      const cart = req.body;
      console.log(productId, cart);
      const filter = { _id: ObjectId(productId) };
      const option = { upsert: true };
      const updatedDoc = {
        $set: cart,
      };
      const result = await addToCartCollection.updateOne(
        filter,
        updatedDoc,
        option
      );
      res.send(result);
    });
    //Updating user profiles
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const profile = req.body;
      const filter = { email: email };
      const option = { upsert: true };

      const updatedDoc = {
        $set: profile,
      };
      const result = await userCollection.updateOne(filter, updatedDoc, option);

      res.send(result);
    });
    //Adding Review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const reviewData = {
        name: review.name,
        email: review.email,
        image: review.image,
        review: review.review,
        productId: review.productId,
        ratings: parseFloat(review.ratings),
      };
      console.log(reviewData);
      const result = await reviewCollection.insertOne(reviewData);
      res.send(result);
    });
    //Getting All Reviews
    app.get("/reviews", async (req, res) => {
      const allReviews = await reviewCollection.find().toArray();
      res.send(allReviews);
    });

    //Creating Payment
    app.post("/create_payment_intent", async (req, res) => {
      const price = req.body.totalAmountToPay;

      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    //Removing cart items after payment
    app.delete("/removeFromCart/:email", async (req, res) => {
      const email = req.params.email;
      const removeFromCart = await addToCartCollection.deleteMany({
        email: email,
      });
      res.send(removeFromCart);
    });
    //Adding the orders
    app.post("/addToOrders", async (req, res) => {
      const orders = req.body;
      const selectedProperties = orders.filteredProductsByEmail.map((order) => {
        delete order._id;
        return order;
      });
      console.log(selectedProperties);
      const addedOrders = await orderCollection.insertMany(selectedProperties);
      res.send(addedOrders);
    });
    //Displaying the orders
    app.get("/displayOrders", async (req, res) => {
      const orders = await orderCollection.find().toArray();
      res.send(orders);
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
