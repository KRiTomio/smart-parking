const express = require("express");
const cors = require("cors");
require("dotenv").config();

const parkingRoutes = require("./routes/parkingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/parking", parkingRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
