const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

//Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tsciz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Medical");
    const PrescriptionsCollection = database.collection("Prescriptions");
    const staffsCollection = database.collection("staffs");
    const reportsCollection = database.collection("reports");

    // GET DATA
    app.get("/prescriptions", async (req, res) => {
      const drug = PrescriptionsCollection.find({});
      const result = await drug.toArray();
      res.send(result);
    });
    // GET DATA
    app.get("/staffs", async (req, res) => {
      const staff = staffsCollection.find({});
      const result = await staff.toArray();
      res.send(result);
    });
    // GET DATA
    app.get("/reports", async (req, res) => {
      const reports = reportsCollection.find({});
      const result = await reports.toArray();
      res.send(result);
    });

    //Add Product
    app.post("/staffs", async (req, res) => {
      const staffs = req.body;
      const doc = {
        type: staffs.type,
        email: staffs.email,
      };
      const result = await staffsCollection.insertOne(doc);
      res.send(result);
    });
    //Add Product
    app.post("/prescriptions", async (req, res) => {
      const prescriptions = req.body;
      const doc = {
        drugName: prescriptions.drugName,
        dosage: prescriptions.dosage,
        time: prescriptions.time,
      };
      const result = await PrescriptionsCollection.insertOne(doc);
      res.send(result);
    });

    // Update
    app.put("/reports/:id", async (req, res) => {
      const id = req.params.id;
      const report = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: report,
      };
      const result = await reportsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //Delete Product
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await PrescriptionsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
