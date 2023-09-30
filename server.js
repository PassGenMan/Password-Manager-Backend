// server renders here
const express= require('express');
const fs= require('fs');
const bodyParser= require('body-parser');
const cors= require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

async function run() {
    try {
      await client.connect();
      await client.db(process.env.DB_NAME).command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);


async function newUser(req,res){
    try {
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(process.env.USER_COLLECTION);
        data= req.body;

        const result = await collection.insertOne(data);
        console.log("Data inserted:", result.insertedId);
        res.send(data)
        // closeConnection();
    } catch (err) {
        console.error("Error inserting data:", err);
    }
    
};

async function getUser(req, res){
    
}

async function updateUser(req, res){
    console.log("user updated");
}

async function deleteUser(req, res){
    console.log("user deleted")
}

async function getSignUpPage(req, res){
    
}

async function getSignInPage(req, res){

}

async function signedIn(req, res){

}


async function deleteData(req,res){
    console.log("data deleted");
}

async function getData(req, res){
    
}

async function addData(req, res){
    console.log("data added");
}

async function updateData(req, res){
    console.log("data updated");
}



const app= express();

const authRouter= express.Router();
const dataRouter= express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

app.use('/auth', authRouter)
app.use('/profile', dataRouter);

authRouter
.route('/signUp')
.get(getSignUpPage)
.post(newUser)

authRouter
.route('/signIn')
.get(getSignInPage)
.post(signedIn)

dataRouter
.route('/:id')
.get(getData)
.post(addData)
.patch(updateData)
.delete(deleteData)



const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("listening from server");
})
