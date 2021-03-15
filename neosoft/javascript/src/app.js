const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken');

var network = require('./fabric/network.js');
const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

/*********************************************** Offledger end-points************************/
const users = [
  {
      username: 'neosoft',
      password: 'password123',
      role: 'admin'
  }
]

const refreshTokens = [];

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  // read username and password from request body
  const { username, password } = req.body;

  // filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if (user) {
      // generate an access token
      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

      refreshTokens.push(refreshToken);

      res.json({
          accessToken,
          refreshToken
      });
  } else {
      res.send('Username or password incorrect');
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
      return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
      return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }

      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

      res.json({
          accessToken
      });
  });
});

app.post('/logout', (req, res) => {
  const { token } = req.body;

  refreshTokens = refreshTokens.filter(token => t !== token);

  res.send("Logout successful");
});


/******************BLOCKCHAIN END POINTS START HERE ******************************************/
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
}

app.post('/create_notes', (req, res) => { 
  console.log(req.body);    
      network.createNotes(
        req.body.emailid,
        req.body.title,
        req.body.notes)
      .then((response) => {
        res.send(response)
      });
    })  

app.post('/update_notes',authenticateJWT,(req,res) => {
  console.log(req.body);    
      network.updateNotes(
        req.body.emailid,
        req.body.title,
        req.body.notes)
      .then((response) => {
        res.send(response)
      });
    })  

app.post('/delete_notes',authenticateJWT,(req,res) => {
  console.log(req.body);
     network.deleteNotes(req.body.emailid)
      .then((response) => {
        res.send(response)
      });
})
//******************************************** Get Method endpoints ******************************/
app.get('/getnotesBy_emailid',authenticateJWT,(req,res) => {
  console.log(req.body);
     network.getsinglenotes(req.body.emailid)
      .then((response) => {
        res.send(response)
      });
})

app.get('/getAllnotes',authenticateJWT,(req,res) => {
  console.log(req.body);
     network.getAllnotes()
      .then((response) => {
        res.send(response)
      });
})


app.listen(process.env.PORT || 8081)
