const express = require("express");
const app = express();
const userRouter = require("./routes/UserRoutes");
const noteRouter = require("./routes/noteRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/", (req,res)=>{
    res.send("Notes API From Zaryab")
})

app.use("/users", userRouter);
app.use("/notes",noteRouter);


mongoose.connect(process.env.MONGO_URL)
.then(
    ()=>{
        app.listen(PORT,()=>{
            console.log("app started at port 5000");
        });
    }
).catch(
    (error)=>{
        console.log(`error: ${error}`)
    }
)
