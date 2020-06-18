'use strict';
const { Contract} = require('fabric-contract-api');
var base64 = require('base-64');
class veritable extends Contract {
  async init(ctx) {
  
    console.log("<== veritable Chaincode==>");
    
     }
/*****************************Put method to store  notary data**********************/

     async encodeAndStoreUserData(ctx, notaryId, first_name,last_name,username,phone,notary_license_number) {
      console.info('============= START : mapp Notary user data to AppID ===========');
      // let timeStamp= await ctx.stub.getTxTimestamp();
      // const timestamp = new Date(timeStamp.getSeconds() * 1000).toISOString();
      let userAsBytes = await ctx.stub.getState(notaryId); 
      if (!userAsBytes || userAsBytes.toString().length <= 0) {

        let userDocs = {
          NotaryId:notaryId,
          First_name:first_name,
          Last_name:last_name,
          Username:username,
          Phone:phone,
          Notary_license_number:notary_license_number,
          Type: 'notary',
          SignersData: [],
          clientdata:[],
          DocdataSigner:[],
          Docdata:[],
          hash:""
        }
        let inputdata = JSON.stringify(userDocs);
        var encoded = base64.encode(inputdata);
        console.log(encoded);
        userDocs.hash = encoded;
      await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(userDocs)));
      console.info('============= END : notary data put into BLOCKCHAIN ===========');
      let response = {
        NotaryId: notaryId,
        Notary_license_number:notary_license_number,
        success : 'true',
        message : "Notary Details encoded and stored in Blockchain",
        Hash : userDocs.hash
      }
      return JSON.stringify(response);
    }
    else {
      return ({Error: "2020"});
    }
  }

/**********************PUT method to add sellerData***************************************/

async clientdata(ctx,notaryId,clientId,first_name,last_name,emailid) {
  console.info('============= START : mapp signers data to AppID ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect appId..!"});
  }
  let sellerAsBytes = await ctx.stub.getState(clientId);
  if (!sellerAsBytes || sellerAsBytes.toString().length <=0){
    let sellerData = {
      NotaryId:notaryId,
      ClientId:clientId,
      Type: 'seller',
      First_name:first_name,
      Last_name:last_name,
      Emailid:emailid,
      APN_number:'false',
      hash:"",
      Documents:[]
    }
  let inputdata = JSON.stringify(sellerData);
  var encoded = base64.encode(inputdata);
  sellerData.hash = encoded;
  let Sellerinfo = JSON.parse(userAsBytes);
  Sellerinfo.SignersData.length = 0;
  // var encoded = base64.encode(Sellerinfo);
  // Sellerinfo.SignersData[0].hash = encoded;
  Sellerinfo.SignersData.push(sellerData);
  await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(Sellerinfo)));
  let SellerDataInfo = JSON.parse(userAsBytes);
  SellerDataInfo.SignersData.push(sellerData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(SellerDataInfo)));
  console.info('============= END : seller data put into BLOCKCHAIN ===========');
  let response = {
    NotaryId:notaryId,
    ClientId: clientId,
    hash: sellerData.hash,
    success : 'true',
    message : clientId + " details stored in Blockchain"
  }
  return JSON.stringify(response);
}else {
  return ({Error: "2020"});
    }
  }
/**********************PUT method to add buyerData********************************************************************/
async partiesdata(ctx,notaryId,partiesId,first_name,last_name,emailid) {
  console.info('============= START : mapp buyers data to AppID ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect appId..!"});
  }
  let buyerAsBytes = await ctx.stub.getState(partiesId);
  if (!buyerAsBytes || buyerAsBytes.toString().length <=0){
    let buyerData = {
      NotaryId:notaryId,
      Type: 'buyer',
      PartiesId:partiesId,
      First_name:first_name,
      Last_name:last_name,
      Emailid:emailid,
      APN_number:'false',
      Status:'pending',
      hash:"",
      Documents:[]
    }
  let inputdata = JSON.stringify(buyerData);
  var encoded = base64.encode(inputdata);
  buyerData.hash = encoded;
  let Buyerinfo = JSON.parse((userAsBytes));
  Buyerinfo.SignersData.length = 0;
  // var encoded = base64.encode(Buyerinfo);
  // Buyerinfo.SignersData[0].hash = encoded;
  Buyerinfo.SignersData.push(buyerData);
  await ctx.stub.putState(partiesId, Buffer.from(JSON.stringify(Buyerinfo)));
  let BuyerDataInfo = JSON.parse(userAsBytes);
  BuyerDataInfo.SignersData.push(buyerData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(BuyerDataInfo)));
  console.info('============= END : buyer data put into BLOCKCHAIN ===========');
  let response = {
    NotaryId:notaryId,
    PartiesId: partiesId,
    hash: Buyerinfo.SignersData[0].hash,
    success : 'true',
    message : buyerData.PartiesId +" details stored in Blockchain"
  }
  return JSON.stringify(response);
}else {
  return ({Error: "2020"});
    }
  }
/*****************************PUT APN data into Blockchain************************************************************/
async attachAPNDocuments(ctx,notaryId,clientId,document_type,document_name,apn_number) {
  console.info('============= START : mapp seller documents to sellerid ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect appId..!"});
  }
  let sellerAsBytes = await ctx.stub.getState(clientId);
  if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect Seller Id..!"});
  } 
  let check = JSON.parse(sellerAsBytes);
  if(check.SignersData[0].Type!== 'seller'){
    return({Error: check.SignersData[0].ClientId + " is not client"})
  }
  if(check.SignersData[0].APN_number== apn_number){
  return({Error: check.SignersData[0].ClientId + " details already uploaded..!"})
  }
   else {
    let apnData = {
      NotaryId:notaryId,
      ClientId:clientId,
      Document_type: document_type,
      Document_name: document_name,
      APN_number: apn_number,
      Status:"pending"
    } 
  check.SignersData[0].APN_number = apn_number;
  await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(check)));
  check.SignersData[0].Documents.push(apnData);
  await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(check)));
  let Seller = JSON.parse(userAsBytes);
  Seller.SignersData[0].Documents.push(apnData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(Seller)));
  console.info('============= END : APN documents into BLOCKCHAIN ===========');
  let response = {
    NotaryId:check.NotaryId,
    ClientId:apnData.ClientId,
    success : 'true',
    message : apnData.APN_number + " document stored in Blockchain"
  }
    return JSON.stringify(response);
}
}
/*****************************PUT METHOD TO ADD Seller's DOCUMENTS*****************************************************/
    async attachclientDocuments(ctx,notaryId,clientId,apn_number,passport,driving_license,passportcard,work_permit,residence_permit,visa,nic) {
      console.info('============= START : mapp seller documents to sellerid ===========');
      let userAsBytes = await ctx.stub.getState(notaryId); 
      if (!userAsBytes || userAsBytes.toString().length <= 0){
        return({Error: "Incorrect appId..!"});
      }
      let sellerAsBytes = await ctx.stub.getState(clientId);
      if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
        return({Error: "Incorrect sellerId..!"});
      } 
      let check1 = JSON.parse(sellerAsBytes);  
      if(check1.SignersData[0].Type!== 'seller'){
        return({Error: check1.SignersData[0].ClientId + " is not client..!"});
      }
      if(check1.SignersData[0].Documents[0].Status== 'sold'){
        return({Error: check1.SignersData[0].ClientId + " not Authorised for " + check1.SignersData[0].Documents[0].APN_number})
      }
      if(check1.SignersData[0].Documents[0].APN_number!== apn_number){
        return({Error: " Please enter correct APN number "})
      }
      else {
        let documentData = {
          NotaryId:notaryId,
          ClientId:clientId,
          Passport : passport,
          Driving_license: driving_license,
          Passportcard: passportcard,
          Work_permit: work_permit,
          Residence_permit: residence_permit,
          Visa:visa,
          Nic:nic
        }
      check1.SignersData[0].Documents[0].Status = 'sold';
      await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(check1)));
      check1.SignersData[0].Documents.push(documentData);
      await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(check1)));
      let Seller = JSON.parse(userAsBytes);
      Seller.SignersData[0].Documents.push(documentData);
      await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(Seller)));
      console.info('============= END : sellersdocuments into BLOCKCHAIN ===========');
      let response = {
        NotaryId:check1.NotaryId,
        ClientId:documentData.ClientId,
        success : 'true',
        message : documentData.ClientId + " documents stored in Blockchain"
      }
      return JSON.stringify(response);
      }
  }
/*****************************PUT METHOD TO ADD Buyer's DOCUMENTS*****************************************************/
async attachpartiesDocuments(ctx,notaryId,partiesId,clientId,passport,driving_license,passportcard,work_permit,residence_permit,visa,nic) {
  console.info('============= START : mapp buer documents to buyerid ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect appId..!"});
  }
  let buyerAsBytes = await ctx.stub.getState(partiesId); 
  if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect buyerId..!"});
  }
  let sellerAsBytes = await ctx.stub.getState(clientId);
  if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect sellerId..!"});
  }
  let seller = JSON.parse(sellerAsBytes)
  let buyer = JSON.parse(buyerAsBytes);
  // var buyer = 'buyer';
  // for (i = 0; i < check.buyerdata.length; i++) {
  if(buyer.SignersData[0].Type!== 'buyer'){
    return({Error: "Please enter correct buyerId..!"})
  }
  if(buyer.SignersData[0].Status== 'completed'){
    return({Error: partiesId + ' details already uploaded into Blockchain'})
  }
  else {
    let documentData = {
      NotaryId:notaryId,
      PartiesId:partiesId,
      // APN_number: seller.SignersData[0].Documents[0].APN_number,
      Passport : passport,
      Driving_license: driving_license,
      Passportcard: passportcard,
      Work_permit: work_permit,
      Residence_permit: residence_permit,
      Visa:visa,
      Nic:nic
    }
  buyer.SignersData[0].Status = 'completed';
  buyer.SignersData[0].APN_number = seller.SignersData[0].Documents[0].APN_number;
  await ctx.stub.putState(partiesId, Buffer.from(JSON.stringify(buyer)));
  // let Bdocument = JSON.parse(buyerAsBytes);
  buyer.SignersData[0].Documents.push(documentData);
  await ctx.stub.putState(partiesId, Buffer.from(JSON.stringify(buyer)));
  let Buyer = JSON.parse(userAsBytes);
  Buyer.SignersData[0].Documents.push(documentData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(Buyer)));
  console.info('============= END : buyerdocuments into BLOCKCHAIN ===========');
  let response = {
    NotaryId:notaryId,
    PartiesId:documentData.PartiesId,
    success : 'true',
    message : documentData.PartiesId + " documents stored in Blockchain"
  }
  return JSON.stringify(response);
  } 
// }  return({Error: "Please enter correct buyerId..!"});
}
/********************ADD Witness for seller****************************************************************/
async clientWitness(ctx,notaryId,clientId,witnessId,first_name,last_name,emailid) {
  console.info('============= START : mapp seller documents to clientId ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect appId..!"});
  }
  let sellerAsBytes = await ctx.stub.getState(clientId);
  if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect Id..!"});
  } 
  let seller = JSON.parse(sellerAsBytes);
  if(seller.SignersData[0].Type!== 'seller'){
    return ({Error: clientId + " is not seller"})
  }else {

    let witnessData = {
      NotaryId:notaryId,
      ClientId:clientId,
      WitnessId:witnessId,
      First_name:first_name,
      Last_name:last_name,
      Emailid:emailid,
      hash:""
    }
  let inputdata = JSON.stringify(witnessData);
  var encoded = base64.encode(inputdata);
  witnessData.hash = encoded;
  let witnessSeller = JSON.parse(sellerAsBytes);
  // var encoded = base64.encode(witnessBuyer);
  // witnessSeller.SignersData[0].hash = encoded;
  witnessSeller.SignersData.push(witnessData);
  await ctx.stub.putState(clientId, Buffer.from(JSON.stringify(witnessSeller)));
  let sellernotary = JSON.parse(userAsBytes);
  sellernotary.SignersData[0].Documents.push(witnessData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(sellernotary)));
  console.info('============= END : witness for buyer stored  into BLOCKCHAIN ===========');
  let response = {
    NotaryId:notaryId,
    ClientId:clientId,
    WitnessId:witnessId,
    hash:witnessData.hash,
    success : 'true',
    message : "witness for  stored in Blockchain"
  }
  return JSON.stringify(response);
 } 
}
/********************ADD Witness for buyer ***************************r***********************************/
async partiesWitness(ctx,notaryId,partiesId,witnessId,first_name,last_name,emailid) {
  console.info('============= START : mapp seller documents to sellerid ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect appId..!"});
  }
  let buyerAsBytes = await ctx.stub.getState(partiesId);
  if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect Id..!"});
  } 
  let buyer = JSON.parse(buyerAsBytes);
  if(buyer.SignersData[0].Type!== 'buyer'){
    return ({Error: partiesId + " is not buyer"})
  }else {
   let witnessData = {
    NotaryId:notaryId,
    PartiesId:partiesId,
    WitnessId:witnessId,
    First_name:first_name,
    Last_name:last_name,
    Emailid:emailid,
    hash:""
  }
  let inputdata = JSON.stringify(witnessData);
  var encoded = base64.encode(inputdata);
  witnessData.hash = encoded;
  let witnessBuyer = JSON.parse(buyerAsBytes);
  // var encoded = base64.encode(witnessBuyer);
  // witnessBuyer.SignersData[0].hash = encoded;
  witnessBuyer.SignersData.push(witnessData);
  await ctx.stub.putState(partiesId, Buffer.from(JSON.stringify(witnessBuyer)));
  let buyernotary = JSON.parse(userAsBytes);
  buyernotary.SignersData[0].Documents.push(witnessData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(buyernotary)));
console.info('============= END : sellersdocuments into BLOCKCHAIN ===========');
let response = {
  NotaryId:notaryId,
  PartiesId:partiesId,
  WitnessId:witnessId,
  hash:witnessData.hash,
  success : 'true',
  message : "witness for stored in Blockchain"
}
return JSON.stringify(response);
 }
}
/********************ADD AddtranID for Notary ***************************r***********************************/
async AddtranIDSigners(ctx,id,notaryId,clientId,partiesId,witnessId,tranID,tranType,docName) {
  console.info('============= START : mapp signers data to AppID ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect Notary..!"});
  } 
  let notarycheck = JSON.parse(userAsBytes);
  if(notarycheck.Type!== 'notary'){
    return({Error: notarycheck.NotaryId + " is not notary"})
  }
  let sellerAsBytes = await ctx.stub.getState(clientId);
  if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect Client Id..!"});
  } 
  let check = JSON.parse(sellerAsBytes);
  if(check.SignersData[0].Type!== 'seller'){
    return({Error: check.SignersData[0].ClientId + " is not client"})
  }
  let buyerAsBytes = await ctx.stub.getState(partiesId); 
  if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect buyerId..!"});
  }
  let buyer = JSON.parse(buyerAsBytes);
  if(buyer.SignersData[0].Type!== 'buyer'){
    return({Error: buyer.SignersData[0].PartiesId + " is not PartiesId"})
  }else {
    let TranxData = {
      Id: id,
      NotaryId: notaryId,
      ClientId:clientId,
      PartiesId:partiesId,
      WitnessId:witnessId,
      TranID: tranID,
      TranType: tranType,
      DocName: docName,
      Hash:''
    }
  let inputdata = JSON.stringify(TranxData);
  var encoded = base64.encode(inputdata);
  TranxData.Hash = encoded;
  let Trxninfo = JSON.parse(userAsBytes);
  Trxninfo.DocdataSigner.push(TranxData);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(Trxninfo)));
  console.info('============= END : seller data put into BLOCKCHAIN ===========');
  let response = {
    Id:TranxData.Id,
    NotaryId:TranxData.NotaryId,
    ClientId: clientId,
    Hash: TranxData.Hash,
    TranID:TranxData.TranID,
    success : 'true',
    message : id + " Mapped with "+ notaryId
  }
  return JSON.stringify(response);
}
// else {
//   return ({Error: "2020"});
//     }
  }
/********************ADD AddtranID for Notary ***************************r***********************************/
async AddtranID(ctx,id,notaryId,clientId,tranID,tranType,docName) {
  console.info('============= START : mapp signers data to AppID ===========');
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect Notary..!"});
  } 
  let notarycheck = JSON.parse(userAsBytes);
  if(notarycheck.Type!== 'notary'){
    return({Error: notarycheck.NotaryId + " is not notary"})
  }
  let sellerAsBytes = await ctx.stub.getState(clientId);
  if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect Client Id..!"});
  } 
  let check = JSON.parse(sellerAsBytes);
  if(check.SignersData[0].Type!== 'seller'){
    return({Error: check.SignersData[0].ClientId + " is not client"})
  }
    let TranxData1 = {
      Id: id,
      NotaryId: notaryId,
      ClientId:clientId,
      TranID: tranID,
      TranType: tranType,
      DocName: docName,
      Hash:''
    }
  let inputdata = JSON.stringify(TranxData1);
  var encoded = base64.encode(inputdata);
  TranxData1.Hash = encoded;
  let Trxninfo = JSON.parse(userAsBytes);
  Trxninfo.Docdata.push(TranxData1);
  await ctx.stub.putState(notaryId, Buffer.from(JSON.stringify(Trxninfo)));
  console.info('============= END : seller data put into BLOCKCHAIN ===========');
  let response = {
    Id:TranxData1.Id,
    NotaryId:TranxData1.NotaryId,
    Hash: TranxData1.Hash,
    TranID:TranxData1.TranID,
    success : 'true',
    message : id + " Mapped with "+ notaryId
  }
  return JSON.stringify(response);
}
// else {
//   return ({Error: "2020"});
//     }
// /********************************Clientdata********************************************/
// async addClientData(ctx,appId,scan_Reference_Number,first_name,last_name,emailid,phone) {
//   console.info('============= START : mapp signers data to AppID ===========');
//   let userAsBytes = await ctx.stub.getState(appId); 
//   if (!userAsBytes || userAsBytes.toString().length <= 0){
//     return({Error: "Incorrect appId..!"});
//   }
//     let clientData = {
//       Appid:appId,
//       Scan_Reference_Number:scan_Reference_Number,
//       First_name:first_name,
//       Last_name:last_name,
//       Emailid:emailid,
//       Phone:phone,
//       hash:"",
//     }
//   let inputdata = JSON.stringify(clientData);
//   var encoded = base64.encode(inputdata);
//   clientData.hash = encoded;
//   // let Sellerinfo = JSON.parse(userAsBytes);
//   // Sellerinfo.SignersData.length = 0;
//   // Sellerinfo.SignersData.push(sellerData);
//   // await ctx.stub.putState(sellerId, Buffer.from(JSON.stringify(Sellerinfo)));
//   let clientDataInfo = JSON.parse(userAsBytes);
//   clientDataInfo.clientdata.push(clientData);
//   await ctx.stub.putState(appId, Buffer.from(JSON.stringify(clientDataInfo)));
//   console.info('============= END : seller data put into BLOCKCHAIN ===========');
//   let response = {
//     AppId:appId,
//     hash: clientData.hash,
//     success : 'true',
//     message : " Client details stored in Blockchain"
//   }
//   return JSON.stringify(response);
//   }

/***********************GET Method to get buyer Data************************************/

async getpartiesData(ctx,partiesId) {
     
  let buyerAsBytes = await ctx.stub.getState(partiesId); 
  if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect buyerId..!"});
    }
else {
  let buyerdata=JSON.parse(buyerAsBytes.toString());
    console.log(buyerdata.SignersData);
    return JSON.stringify(buyerdata.SignersData);
      }
    }
/****************************GET METHOD to get seller data********************************/
  async getclientData(ctx,clientId) {
     
    let sellerAsBytes = await ctx.stub.getState(clientId); 
    if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
    return({Error: "Incorrect sellerid..!"});
        }
    else {
    let sellerdata=JSON.parse(sellerAsBytes.toString());
    console.log(sellerdata.SignersData);
    return JSON.stringify(sellerdata.SignersData);
       }
     }
/***********************GET Method to get Transaction data of signers ************************************/

async getAddtranIDSigners(ctx,notaryId) {
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0) {
    return({Error: "Incorrect notary..!"});
    }
else {
  let clientdatatranIDSigners=JSON.parse(userAsBytes.toString());
    console.log(clientdatatranIDSigners.DocdataSigner);
    return JSON.stringify(clientdatatranIDSigners.DocdataSigner);
      }
    }
/***********************GET Method to get Transaction data************************************/

async getAddtranID(ctx,notaryId) {
  let userAsBytes = await ctx.stub.getState(notaryId); 
  if (!userAsBytes || userAsBytes.toString().length <= 0) {
    return({Error: "Incorrect notary..!"});
    }
else {
  let clientdatatranID=JSON.parse(userAsBytes.toString());
    console.log(clientdatatranID.Docdata);
    return JSON.stringify(clientdatatranID.Docdata);
      }
    }
/*****************************GET Method to get All data*******************************/
    async getAllData(ctx,notaryId) {
   
    let userAsBytes = await ctx.stub.getState(notaryId); 
    if (!userAsBytes || userAsBytes.toString().length <= 0) {
      return({Error: "Incorrect AppId..!"});
          }
     else {
       let userDocs=JSON.parse(userAsBytes.toString());
       console.log(userDocs);
       return JSON.stringify(userDocs);
            }
        }
}

module.exports = veritable;