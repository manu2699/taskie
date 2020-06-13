const express = require("express");
const app = express.Router();

const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const SimpleCrypto = require("simple-crypto-js").default;
let simpleCrypto = new SimpleCrypto(process.env.KEY)
const secret = process.env.SECRET;

let db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

app.post("/query", (req, res) => {
  db.query(req.body.query, (err, result) => {
    if (err)
      res.send(err)
    res.send(result)
  })
})

app.get("/userSetup", (req, res) => {
  //query to create user table.
  db.query(`create table users
            ( 
              id int(6) unsigned auto_increment primary key, 
              email varchar(50) not null, 
              name varchar(50) not null, 
              password varchar(300) not null, 
              unique(email)
            );`,
    (err, result) => {
      if (err)
        res.send(err)
      res.send(result)
    })
})


app.post("/verify", (req, res) => {
  jwt.verify(req.body.token, secret, (err, decoded) => {
    console.log(decoded)
    res.send(decoded)
  });
})

app.post('/login', (req, res) => {
  db.query(`Select * from users where email = "${req.body.email}"`, (err, result) => {
    if (err)
      res.send(err);
    //decrypting user password.
    var plainpass = simpleCrypto.decrypt(result[0].password);
    if (plainpass === req.body.password) {
      const payload = {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
      };
      // Generating Token for the user.
      let token = jwt.sign(payload, secret);
      res.send({ token });
    } else {
      res.send({ message: "Wrong password" })
    }
  })
})


app.post('/signup', (req, res) => {
  let email = req.body.email, password = req.body.password, uname = req.body.name;
  //encrypting the password.
  let chipherpass = simpleCrypto.encrypt(password);
  password = chipherpass;
  db.query(`Insert into users (email, name, password) values("${email}", "${uname}", "${password}")`, (err, result) => {
    if (err)
      res.send(err);
    res.send(result)
  })
})

module.exports = app;