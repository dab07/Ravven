import express, {Request, Response} from "express";
import mongoose = require('mongoose');
import router from './router/userRoutes'

const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors')

const PORT : number = 3000

app.use(cookieParser())
app.use(cors({credentials : true, origin:'http://localhost:8081'}))
app.use(express.json())
app.use('/', router)

const uri = "mongodb+srv://ravven:GfEgKsKRXRXDVHAy@blog.wqjah.mongodb.net/?retryWrites=true&w=majority&appName=Blog";

const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    } as any
};

mongoose.connect(uri, clientOptions)
    .then(() => console.log("MongoDB connected"))
    .catch(error => console.error("Connection failed", error));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// MondoDb CLuster Credentials - ravven, Cluster@123
