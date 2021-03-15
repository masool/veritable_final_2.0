'use strict';
const { Contract} = require('fabric-contract-api');
var base64 = require('base-64');
class fabricDrive extends Contract {

  async init(ctx) {
  
    console.log("<== veritable Chaincode==>");
    
     }
/***************************** Create notes ************************************************/
async createNotes(ctx,emailid,title,notes) {
let userAsBytes = await ctx.stub.getState(emailid); 
if (!userAsBytes || userAsBytes.toString().length <= 0){
    let data = {
      Emailid:emailid,
      Title: title,
      Notes:notes
    }
    await ctx.stub.putState(emailid, Buffer.from(JSON.stringify(data)));
  let response = {
    Emailid:emailid,
    Title: title,
    Notes:notes,
    success : 'true',
  }
  return JSON.stringify(response);
}
else {
  return ({Error: emailid+ " not registed..!!"});
}
}

/***************************** Update notes ************************************************/

async updateNotes(ctx,emailid,title,notes) {
let userAsBytes = await ctx.stub.getState(emailid); 
if (!userAsBytes || userAsBytes.toString().length <= 0){
  return({Error: "Incorrect" + emailid + " ..!!"});
  }else {
let inputdata = JSON.parse(userAsBytes);
inputdata.Notes = notes, inputdata.Title = title
await ctx.stub.putState(emailid, Buffer.from(JSON.stringify(inputdata)));
let response = {
Title: inputdata.Title,
success : 'true',
message : inputdata.Title + " has been updated in to NEOSOFT Blockchain"
}
return JSON.stringify(response);
}
}
/***************************** Delete note State ************************************************/

async deleteNotes(ctx,emailid) {
  let userAsBytes = await ctx.stub.getState(emailid); 
  if (!userAsBytes || userAsBytes.toString().length <= 0){
    return({Error: "Incorrect" + emailid + " ..!!"});
    }else {
  // let inputdata = JSON.parse(userAsBytes.toString());
  let inputdataJSON = JSON.parse(userAsBytes);
  let inputdata = ctx.stub.createCompositeKey(emailid, [inputdataJSON.Notes, inputdataJSON.Title]);
  await ctx.stub.deleteState(inputdata);
  return JSON.stringify({success: emailid+ " has been removed from NEOSOFT Blockchain"});
  }
  }
/***************************** Get Single note Data ************************************************/
async getsinglenotes(ctx,emailid) {
 
let userAsBytes = await ctx.stub.getState(emailid); 
if (!userAsBytes || userAsBytes.toString().length <= 0) {
return({Error: "Incorrect" + emailid + " ..!!"});
    }
else {
let data=JSON.parse(userAsBytes.toString());
console.log(data);
return JSON.stringify(data);
   }
 }

//***************************** Quer all notes from the ledger ************************************************/

 async getAllnotes(ctx) {

  const startKey = '';
  const endKey = '';
  const allResults = [];
  const iterator = await ctx.stub.getStateByRange(startKey, endKey);
    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let Record;
            try {
                Record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                Record = res.value.value.toString('utf8');
            }
            allResults.push({ Key, Record });
        }
        if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return JSON.stringify(allResults);
        }
    }
}

}

module.exports = fabricDrive;