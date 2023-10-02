// server renders here
const express= require('express');
const fs= require('fs');
const bodyParser= require('body-parser');
const cors= require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const cookieParser= require('cookie-parser')

const bcrypt= require('bcryptjs');
const salt= bcrypt.genSaltSync(10);

const User = require('./models/User')

mongoose.connect("mongodb+srv://iamnazmussaqib:password-manager-123@password-manager-cluste.cevsmhr.mongodb.net/?retryWrites=true&w=majority")

const app= express();
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

app.post('/register',async (req,res)=>{
    const {username, password}= req.body;
    try{
        const userDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password,salt)
        });
        res.json(userDoc);

    }catch(e){
        console.log(e);
        res.status(400).json(e);
    }
})


app.listen(4000);