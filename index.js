const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zmtojm.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // all jobs 
    const jobCollection = client.db("jobsDB").collection("Jobs");

    app.get('/jobs', async (req, res) => {
      const cursor = jobCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    })

    app.post('/jobs', async (req, res) => {
      const newJobs = req.body;
      const result = await jobCollection.insertOne(newJobs);
      res.send(result);
    })

    app.put('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedJob = req.body;
      const setProduct = {
        $set: {
          photo: updatedJob.photo,
          job: updatedJob.job,
          salary: updatedJob.salary,
          startDate: updatedJob.startDate,
          deadline: updatedJob.deadline,
          description: updatedJob.description,
          banner: updatedJob.banner
        }
      }
      const result = await jobCollection.updateOne(filter, setProduct, options);
      res.send(result);
    })

    app.delete('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    })


    // applied jobs 
    const appliedCollection = client.db("jobsDB").collection("AppliedJobs");

    app.get('/appliedJobs', async (req, res) => {
      const cursor = appliedCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    
    app.post('/appliedJobs', async (req, res) => {
      const newAppliedJobs = req.body;
      const result = await appliedCollection.insertOne(newAppliedJobs);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('JOB SEEKING SERVER IS RUNNING')
})

app.listen(port, () => {
  console.log(`JOB SEEKING is running on PORT: ${port}`)
})