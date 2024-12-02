const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To handle JSON body payloads
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// MongoDB URI and Client Initialization
const uri = process.env.MONGO_URI || "your-default-mongo-uri";
const client = new MongoClient(uri, {
  tls: true, // Ensure TLS is used for secure communication
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectMongoDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if unable to connect
  }
}

// API Endpoints

// Fetch data from MongoDB
app.get("/api", async (req, res) => {
  try {
    const db = client.db("eventsdb");
    const collection = db.collection("eventscollection");
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the Server
app.listen(port, async () => {
  await connectMongoDB();
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("⏳ Closing MongoDB connection...");
  await client.close();
  console.log("✅ MongoDB connection closed.");
  process.exit(0);
});
