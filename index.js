const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const Transaction = require('./models/Transaction.js')

const app = express();
const PORT = 3000;
const User = require("./models/User.js");

const router = express.Router();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'https://lively-dolphin-46223f.netlify.app/'  // replace with your actual Netlify URL
}));
const url = "mongodb+srv://yaswanthraje2004:yash7418340216@blog.emzfxlh.mongodb.net/?retryWrites=true&w=majority&appName=Blog";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });


app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    const transactions = await Transaction.find();
    res.status(201).json({ message: "Transaction created successfully", transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    const transactions = await Transaction.find();
    res.status(200).json({ message: "Transaction deleted successfully", transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/transactions", addTransaction);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      // Compare the input password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'Login successful' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
