//***************************ADD Client data*************************************************/

exports.putClientData = async function(notaryId,clientId,first_name,last_name,emailid) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerclientUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('clientdata', notaryId,clientId,first_name,last_name,emailid);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//***************************ADD Parties data*************************************************/
exports.putPartiesData = async function(notaryId,partiesId,first_name,last_name,emailid) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('partiesUser');
        if (!identity) {
            console.log('An identity for the user "partiesUser" does not exist in the wallet');
            console.log('Run the registerpartiesUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'partiesUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('clientdata', notaryId,partiesId,first_name,last_name,emailid);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//***************************Attach APN DOCS***************************************************/
exports.attachAPNDocuments = async function(notaryId,clientId,document_type,document_name,apn_number) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerclientUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('attachAPNDocuments', notaryId,clientId,document_type,document_name,apn_number);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//***************************Attach Client Docsa*************************************************/
exports.attachclientDocuments = async function(notaryId,clientId,apn_number,passport,driving_license,passportcard,work_permit,residence_permit,visa,nic) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerclientUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('attachclientDocuments', notaryId,clientId,apn_number,passport,driving_license,passportcard,work_permit,residence_permit,visa,nic);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//***************************Attach Parties Docsa*************************************************/
exports.attachpartiesDocuments = async function(notaryId,partiesId,clientId,passport,driving_license,passportcard,work_permit,residence_permit,visa,nic) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('partiesUser');
        if (!identity) {
            console.log('An identity for the user "partiesUser" does not exist in the wallet');
            console.log('Run the registerpartiesUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'partiesUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('attachpartiesDocuments', notaryId,partiesId,clientId,passport,driving_license,passportcard,work_permit,residence_permit,visa,nic);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//***************************Attach Client witness*************************************************/
exports.clientWitness = async function(notaryId,clientId,witnessId,first_name,last_name,emailid) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerclientUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('clientWitness', notaryId,clientId,witnessId,first_name,last_name,emailid);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//***************************Attach parties witness *************************************************/
exports.partiesWitness = async function(notaryId,partiesId,witnessId,first_name,last_name,emailid) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('partiesUser');
        if (!identity) {
            console.log('An identity for the user "partiesUser" does not exist in the wallet');
            console.log('Run the registerpartiesUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'partiesUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.submitTransaction('partiesWitness', notaryId,partiesId,witnessId,first_name,last_name,emailid);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//^^^^^^^^^^^^^^^^^^^^^^^^GET methods ***************************************************************/
//*************************** Get Clients data *************************************************/
exports.getclientData = async function(clientId) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerclientUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.evaluateTransaction('getclientData', clientId);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//*************************** Get Parties data *************************************************/
exports.getpartiesData = async function(partiesId) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('partiesUser');
        if (!identity) {
            console.log('An identity for the user "partiesUser" does not exist in the wallet');
            console.log('Run the registerpartiesUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'partiesUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.evaluateTransaction('getpartiesData', partiesId);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//*************************** Get Notaries data *************************************************/
exports.getAllData = async function(notaryId) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('notaryUser');
        if (!identity) {
            console.log('An identity for the user "notaryUser" does not exist in the wallet');
            console.log('Run the registernotaryUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'notaryUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('veritable');
        const result = await contract.evaluateTransaction('getAllData', notaryId);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
