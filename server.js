import express from "express";
import cors from "cors";
import "express-async-errors";
import db from "./db/connection.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

// Collection name (coming from .env file)
const collectionName = process.env.DB_COLLECTION || "";

app.use(cors());
app.use(express.json());

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Default '/' route
app.get("/", async (req, res) => {
  res.send("hello world");
});

// Get 10 documents
app.get("/test", async (req, res) => {
  let collection = await db.collection(collectionName);
  let results = await collection.find({}).limit(10).toArray();

  res.send(results).status(200);
});

// Get a single document
app.get("/test/:id", async (req, res) => {
  let collection = await db.collection(collectionName);
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Add a new document to the collection
app.post("/test/", async (req, res) => {
  let collection = await db.collection(collectionName);
  let newDocument = req.body;
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Delete a Document
app.delete("/test/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection(collectionName);
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

// Update the Document
app.patch("/test/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  // here i am simply updating the name
  const updates = {
    $set: { name: req.body.name },
  };

  let collection = await db.collection(collectionName);
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});
