const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

var network = require('./fabric/network.js');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

/******************BLOCKCHAIN END POINTS START HERE ******************************************/
app.post('/createNotaryData', (req, res) => { 
  console.log(req.body);    
      network.putNotaryuser(
        req.body.notaryId,
        req.body.first_name,
        req.body.last_name,
        req.body.username,
        req.body.phone,
        req.body.notary_license_number)
      .then((response) => {
        res.send(response)
      });
    })  

app.post('/PartiesData',(req,res) => {
  console.log(req.body);
     network.putPartiesData(
       req.body.notaryId,
       req.body.partiesId,
       req.body.first_name,
       req.body.last_name,
       req.body.emailid)
      .then((response) => {
        res.send(response)
      });
})

app.post('/ClientData',(req,res) => {
  console.log(req.body);
     network.putClientData(   
       req.body.notaryId,
       req.body.clientId,
       req.body.first_name,
       req.body.last_name,
       req.body.emailid)
      .then((response) => {
        res.send(response)
      });
})

app.post('/attachAPNDocuments',(req,res) => {
  console.log(req.body);
     network.attachAPNDocuments(   
       req.body.notaryId,
       req.body.clientId,
       req.body.document_type,
       req.body.document_name,
       req.body.apn_number)
      .then((response) => {
        res.send(response)
      });
})

app.post('/attach_Parties_documents',(req,res) => {
  console.log(req.body);
     network.attachpartiesDocuments(
      req.body.notaryId,
      req.body.partiesId,
      req.body.clientId,
      req.body.passport,
      req.body.driving_license,
      req.body.passportcard,
      req.body.work_permit,
      req.body.residence_permit,
      req.body.visa,
      req.body.nic)
      .then((response) => {
        res.send(response)
      });
})

app.post('/attach_Client_documents',(req,res) => {
  console.log(req.body);
     network.attachclientDocuments(
      req.body.notaryId,
      req.body.clientId,
      req.body.apn_number,
      req.body.passport,
      req.body.driving_license,
      req.body.passportcard,
      req.body.work_permit,
      req.body.residence_permit,
      req.body.visa,
      req.body.nic)
      .then((response) => {
        res.send(response)
      });
})

app.post('/clientWitness',(req,res) => {
  console.log(req.body);
     network.clientWitness(
      req.body.notaryId,
      req.body.clientId,
      req.body.witnessId,
      req.body.first_name,
      req.body.last_name,
      req.body.emailid)
      .then((response) => {
        res.send(response)
      });
})

app.post('/partiesWitness',(req,res) => {
  console.log(req.body);
     network.partiesWitness(
      req.body.notaryId,
      req.body.partiesId,
      req.body.witnessId,
      req.body.first_name,
      req.body.last_name,
      req.body.emailid)
      .then((response) => {
        res.send(response)
      });
})
//**************************************NEW Requirements*********************************8*/
app.post('/AddtranIDSigners',(req,res) => {
  console.log(req.body);
     network.AddtranIDSigners(
      req.body.id,
      req.body.notaryId,
      req.body.clientId,
      req.body.partiesId,
      req.body.witnessId,
      req.body.tranID,
      req.body.tranType,
      req.body.docName)
      .then((response) => {
        res.send(response)
      });
})

app.post('/AddtranID',(req,res) => {
  console.log(req.body);
     network.AddtranID(
      req.body.id,
      req.body.notaryId,
      req.body.clientId,
      req.body.tranID,
      req.body.tranType,
      req.body.docName)
      .then((response) => {
        res.send(response)
      });
})

app.get('/getAddtranIDSigners', (req, res) => {
  console.log(req);
  network.getAddtranIDSigners(req.body.notaryId)
    .then((response) => {           
       res.send(response)
       console.log(response);
      });
 })

 app.get('/getAddtranID', (req, res) => {
  console.log(req);
  network.getAddtranID(req.body.notaryId)
    .then((response) => {           
       res.send(response)
       console.log(response);
      });
 })
//********************************************Ends here new requirements endpoints ******************************/
app.get('/getPartiesdata', (req, res) => {
   console.log(req);
   network.getpartiesData(req.body.partiesId)
   .then((response) => {           
   res.send(response)
   console.log(response);
     });
  })

  app.get('/getClientData', (req, res) => {
    console.log(req);
    network.getclientData(req.body.clientId)
    .then((response) => {           
    res.send(response)
    console.log(response);
      });
   })

app.get('/getAlldata', (req, res) => {
   console.log(req);
   network.getAllData(req.body.notaryId)
     .then((response) => {           
        res.send(response)
        console.log(response);
       });
  })

app.listen(process.env.PORT || 8081)
