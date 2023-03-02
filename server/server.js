const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/test", (req, res) => {
  res.status(200).json({ test: "testValue" });
});

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});
