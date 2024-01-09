const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost:27017/registration", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
  console.log("connection succeeded");
});

const registrationSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  dob: Date,
  termsAccepted: Boolean,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/submit", async (req, res) => {
  const { username, email, password, dob, acceptterms } = req.body;

  const registration = new Registration({
    username,
    email,
    password,
    dob,
    termsAccepted: acceptterms === "on", // Convert checkbox value to a boolean
  });

  try {
    await registration.save();
    res.redirect("/success");
  } catch (error) {
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
