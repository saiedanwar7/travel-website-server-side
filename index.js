const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ysaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//----------- async Function ----------

async function run() {
  try {
    await client.connect();
    const database = client.db("tourism_site");
    const packagesCollection = database.collection("packages");
    const bookingsCollection = database.collection("bookings");
    const experiencesCollection = database.collection('experiences');
    console.log("Message - database connected");

    // work start from here

    // Get Method Package API
    app.get("/packages", async (req, res) => {
      const cursor = packagesCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    // SINGLE GET API
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const package = await packagesCollection.findOne(query);
      res.send(package);
    });

    // Bookings Get API

    app.get("/bookings", async (req, res) => {
      const cursor = bookingsCollection.find({});
      const bookingPackage = await cursor.toArray();
      res.send(bookingPackage);
    });

    // Bookings POST API
    app.post("/bookings", async (req, res) => {
      const newBooking = req.body;
      const result = await bookingsCollection.insertOne(newBooking);
      res.json(result);
    });

    // use Query for My oreder

    app.get("/booking", async (req, res) => {
      const search = req.query.search;
      const query = { userEmail: search };
      const cursor = await bookingsCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });


    // Delete Bookings
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      console.log(("delete product with id", id));

      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.json(result);

    });

    //-------- Update Product -----------

    app.put('/bookings/:id', async (req, res) => {

        const id = req.params.id;
        const updateBooking = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                status: updateBooking.status
            }
        };
        const result = await bookingsCollection.updateOne(filter, updateDoc, options);
        console.log(req.body);
        res.json(result)

    })

      //---- New Package --------
      
      app.post('/packages', async (req, res) => {
        const newPackage = req.body;
        const result = await packagesCollection.insertOne(newPackage);
        // console.log("got new user", req.body);
        console.log("added user", result);
        res.json(result)

    })

    //------- Get ---------
    
        //experience collection
        app.get('/experiences', async (req, res) => {
            const cursor = experiencesCollection.find({});
            const experiences = await cursor.toArray();
            console.log(experiences);
            res.send(experiences);
        });


  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("Running this site in port", port);
});
