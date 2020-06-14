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

const nodemailer = require("nodemailer");


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAILID,
    refreshToken: process.env.REFRESH_TOKEN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  }
});

transporter.verify((error, success) => {
  if (error) return console.log(error)
  transporter.on('token', token => {
    console.log('A New Acess token was generated')
    console.log('User : %s', token.user)
    console.log('Acess Token : %s', token.accessToken)
    console.log('Expires : %s', new Date(token.expires))
  })
})

app.get("/check/:email", (req, res) => {
  var mailOptions = {
    from: "mr.taskie@gmail.com",
    to: req.params.email,
    subject: "Check Mail",
    text: `Hey buddy..`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(error)
      console.log(" err ", error);
    } else {
      res.send(info.response)
      console.log("Email sent: " + info.response);
    }
  });
})

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
  let { taskName, fromEmail, assignTo, taskDesc } = req.body;
  db.query(`Insert into tasks (name, taskfrom, taskto, taskdesc, dateAssigned, status)
    values("${taskName}", "${fromEmail}", "${assignTo}", "${taskDesc}", "${DateString}", "open");`,
    (err, result) => {
      if (err)
        return res.send(err)

      const io = req.app.get("io");
      let listenObj = `newChanges/${fromEmail}`;
      io.emit(listenObj, true);

      listenObj = `newChanges/${assignTo}`;
      io.emit(listenObj, true);
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
    db.query(`Select * from tasks where id = ${req.params.id}`, (er, rest) => {
      if (er)
        return res.send(err)
      // console.log(rest[0].taskfrom, rest[0].taskto)
      const io = req.app.get("io");
      let listenObj = `newChanges/${rest[0].taskfrom}`;
      io.emit(listenObj, true);

      listenObj = `newChanges/${rest[0].taskto}`;
      io.emit(listenObj, true);
      return res.send(result)
    })
  })
})

app.get("/details/:id", (req, res) => {
  db.query(`Select * from tasks where id = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

app.post("/deleteTask/:id", (req, res) => {
  db.query(`Delete from tasks where id = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)

    const io = req.app.get("io");
    let listenObj = `newChanges/${req.body.user1}`;
    io.emit(listenObj, true);

    listenObj = `newChanges/${req.body.user2}`;
    io.emit(listenObj, true);

    return res.send(result)
  })
})

app.post("/addComment/:id", (req, res) => {
  db.query(`Insert into comments (taskid, cmntby, cmnto, cmnt) values (${req.params.id}, "${req.body.from}", "${req.body.to}","${req.body.msg}")`, (err, result) => {
    if (err)
      return res.send(err)
    var mailOptions = {
      from: "mr.taskie@gmail.com",
      to: [req.body.from, req.body.to],
      subject: `New Comment on Task ${req.params.id}`,
      text: `${req.body.from} have posted a new comment... Click here to view https://taskiee.herokuapp.com/task/${req.params.id}!`
    };

    const io = req.app.get("io");
    let listenObj = `comment/${req.params.id}`;
    io.emit(listenObj, true);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(" err ", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.send(result)
  })
})

app.get("/getComments/:id", (req, res) => {
  db.query(`Select * from comments where taskid = ${req.params.id}`, (err, result) => {
    if (err)
      return res.send(err)
    return res.send(result)
  })
})

function authMiddleware(req, res, next) {
  const authHeader = req.headers['auth']
  console.log(authHeader)
  if (authHeader) {
    next()
    return
  } else {
    res.sendStatus(404)
  }
}

module.exports = app;