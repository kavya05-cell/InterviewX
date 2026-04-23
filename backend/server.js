// const path = require("path");
const express=require("express");
const connectDb=require("./config/db");

const routes=require("./routes/waitListRoutes");

const userRoutes=require("./routes/UserRoutes");

// const path = require("path");
const cors = require("cors");
const path = require("path");
const app= express();
const PORT  =3000;
// const cors = require("cors");

// app.use(cors());
// connectDb();
app.use(cors());
app.use(express.json());

// app= express();
connectDb();
//routes
app.use("/api",routes);
//show frontend
app.use(express.static(path.join(__dirname, "../frontend")));
// app.use(express.json());
// app.use("/api",routes);

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})