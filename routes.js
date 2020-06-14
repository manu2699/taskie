const express = require("express");
const app = express.Router();

const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const DateString = require("./date");
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

app.post("/verify", (req, res) => {
  jwt.verify(req.body.token, secret, (err, decoded) => {
    res.send(decoded)
  });
})

app.post('/login', (req, res) => {
  db.query(`Select * from users where email = "${req.body.email}"`, (err, result) => {
    if (err)
      return res.send(err);
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
      return res.send(err);
    res.send(result)
  })
})

app.get("/verifyAssignee/:email", (req, res) => {
  db.query(`select email from users where email = "${req.params.email}"`, (err, result) => {
    if (err)
      return res.send({ message: "assignee not found :(" })
    res.send({ status: "assignee found !" })
  })
})

app.post("/postTask", (req, res) => {
  let { taskName, fromEmail, assignTo, taskComment, taskDesc } = req.body;
  db.query(`Insert into tasks (name, taskfrom, taskto, taskdesc, comment, dateAssigned, status)
    values("${taskName}", "${fromEmail}", "${assignTo}", "${taskDesc}", "${taskComment}", "${DateString}", "open");`,
    (err, result) => {
      if (err)
        return res.send(err)
      return res.send(result)
    })
})

app.get("/toTasks/:email", (req, res) => {
  db.query(`Select * from tasks where taskfrom = "${req.params.email}" order by dateAssigned desc`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

app.get("/myTasks/:email", (req, res) => {
  db.query(`Select * from tasks where taskto = "${req.params.email}" order by dateAssigned desc`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

app.get("/changeStatus/:id/:status", (req, res) => {
  db.query(`Update tasks set status = "${req.params.status}" where id = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

app.get("/details/:id", (req, res) => {
  db.query(`Select * from tasks where id = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

app.get("/deleteTask/:id", (req, res) => {
  db.query(`Delete from tasks where id = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

app.post("/updateComment/:id", (req, res) => {
  db.query(`Update tasks set comment = "${req.body.comment}" where id = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

module.exports = app;