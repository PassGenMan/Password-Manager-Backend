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

const jwt= require('jsonwebtoken')
const secret= "kfnieurhiuh487683686*%&^$^%#gjhbc"

const User = require('./models/User')
const Data= require('./models/Data')

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

app.post('/login', async (req, res)=>{
    const {username, password}= req.body;
    const userDoc= await User.findOne({username});
    const passOK= bcrypt.compareSync(password, userDoc.password);
    if(passOK){
        // res.json(userDoc)
        jwt.sign({username, id: userDoc._id}, secret, {}, (err, token)=>{
            if (err) throw err;
            res.cookie('token', token).json({
                username,
                id: userDoc._id,
            })
        })
    }else{
        res.status(400).json("Wrong Credentials")
    }
})

app.get('/profile', (req, res)=>{
    const {token}= req.cookies;
    jwt.verify(token, secret, {}, (err, info)=>{
        if (err) throw err;
        res.json(info);
    })
})

app.post('/logout', (req,res)=>{
    res.cookie('token', '').json('ok');
})

app.post('/data', (req,res)=>{
    const {token}= req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if (err) throw err;
        const {title, note, pass}= req.body;
        const postDoc= await Data.create({
            title: title,
            note: note,
            pass: pass,
            author: info.id,
        })
        res.json(postDoc);

    })
})

app.get('/data',(req,res)=>{
    const {token}= req.cookies;
    jwt.verify(token, secret, {}, async (err, info)=>{
        if(err){
            res.json([]);
        }
        else{
            res.json(await Data.find({author: info.id})
            .populate('author')
            .sort({createdAt:-1}));
        }
    })
})

app.delete('/data/:id', (req, res)=>{
    Data.deleteOne({_id: req.params.id}).then(()=>{
        res.json("deleted")
    })
})

app.listen(4000);