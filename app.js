const express = require("express");
const { users } = require("./model/index");
const bcrypt = require("bcrypt");
const app = express();

app.set("view engine", "ejs");

//data parse from website entered
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection
require("./model/index");

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/createUser", async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;

  //   validation from server side
  if (!username || !email || !password) {
    res.send("Please fill all the fields");
  }
  await users.create({
    email: email,
    username: username,
    password: bcrypt.hashSync(password, 8),
  });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;

  //   validation from server side
  if (!email || !password) {
    res.send("Please fill all the fields");
  }
  // 1st step checking in database if the email exist or not
  const user = await users.findAll({ where: { email: email } });
  if (!user) {
    res.send("User not found");
  } else {
    // 2nd step checking if the password is correct or not
    if (bcrypt.compareSync(password, user[0].password)) {
      // 3rd step if both are correct then send the response to the user
      res.send("Login successful");
    } else {
      res.send("Incorrect password");
    }
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
