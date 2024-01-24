import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import tasks from "./schema/task.js"
import bodyParser from "body-parser"
import cors from "cors"
import jwt from "jsonwebtoken";
import user from "./schema/user.js";

const secretKey = 'your-secret-key';

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect("mongodb+srv://deptilize:yFvxBOmtGhb509kw@cluster0.4cxuw83.mongodb.net/", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

function authenticateUser(username, password) {
    if (username === 'user123' && password === 'password123') {
      return true;
    }
    return false;
}

function generateJWT(userId) {
    const token = jwt.sign({ sub: userId }, secretKey, { expiresIn: '1h' });
    return token;
}

function verifyJWT(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
  
      // Attach user information to the request for further processing
      req.user = decoded;
  
      next(); // Proceed to the next middleware or route handler
    });
}

app.post("/signup", async (req, res) => {
    try{

        const isAlreadyPresent = await user.findOne({
            userId: req.body.userId,
            password: req.body.pass
        });
        
        console.log(isAlreadyPresent)
        if(isAlreadyPresent){
            res.send({status: false}).status(400);
        }
        else{
            await user.create({
                userId: req.body.userId,
                password: req.body.pass
            })
            
            res.send({status: true}).status(200);
        }
    }
    catch(err){
        console.log(err);
        res.send(err).status(400);
    }
})

app.post("/login", async (req, res) => {
    try{
        const isAlreadyPresent = await user.findOne({
            userId: req.body.userId,
            password: req.body.pass
        });
        
        console.log(isAlreadyPresent)

        if(!isAlreadyPresent){
            res.send({token: null}).status(401);
        } 
        else {
            const token = jwt.sign({ sub: req.body.userId }, secretKey, { expiresIn: '1h' });
            res.send({token: token}).status(200);
        }
    }
    catch(err){
        res.send(err).status(400);
    }
})

app.post('/add', async (req, res) => {
    console.log(req.body);
    try{
        const val = await tasks.create({
            task: req.body.task,
            description: req.body.desc
        })

        console.log(val);
        res.send(val).status(200);
    }
    catch(err){
        console.log(err);
        res.send(err);
    }
})

app.post("/delete", async (req, res) => {
    try{
        const val = await tasks.deleteOne({_id: req.body.id});
        console.log(val);
        res.send(val);
    }
    catch(err){
        consol.log(err);
        res.send(err);
    }
})

app.get("/", async (req, res) => {
    try{
        const val = await tasks.find();
        console.log(val);
        res.send({data: val});
    }
    catch(err){
        res.send(err);
    }
})

app.listen(port, () => {
    console.log(`server is running ${port}`);
})