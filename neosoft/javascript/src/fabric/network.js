/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

/***************************************** CHAINCODES ***********************************************/

/****************************INVOKE CHAINCODE TO SCreate, Update and Delete notes ********************************/
    exports.createNotes = async function(emailid,title,notes) {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'neosoft-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            var response = {};
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('neoUser');
            if (!identity) {
                console.log('An identity for the user "neoUser" does not exist in the wallet');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'neoUser', discovery: { enabled: true, asLocalhost: true } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('neochannel');
    
            // Get the contract from the network.
            const contract = network.getContract('neosoft');
            const result = await contract.submitTransaction('createNotes', emailid,title,notes);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
    
            // Disconnect from the gateway.
            await gateway.disconnect();
            return result
    
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            response.error = error.message;
            return response;
        }
    }

exports.updateNotes = async function(emailid,title,notes) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'neosoft-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('neoUser');
        if (!identity) {
            console.log('An identity for the user "neoUser" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'neoUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('neochannel');

        // Get the contract from the network.
        const contract = network.getContract('neosoft');
        const result = await contract.submitTransaction('updateNotes', emailid,title,notes);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}

exports.deleteNotes = async function(emailid) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'neosoft-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('neoUser');
        if (!identity) {
            console.log('An identity for the user "neoUser" does not exist in the wallet');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'neoUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('neochannel');

        // Get the contract from the network.
        const contract = network.getContract('neosoft');
        const result = await contract.submitTransaction('deleteNotes', emailid);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        return result

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}
//**************************************************************************************************/
//^                                         GET methods                                             /
//**************************************************************************************************/
//*************************** Get notes data *************************************************/
exports.getsinglenotes = async function(emailid) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'neosoft-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('neoUser');
        if (!identity) {
            console.log('An identity for the user "neoUser" does not exist in the wallet');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'neoUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('neochannel');
        const contract = network.getContract('neosoft');
        const result = await contract.evaluateTransaction('getsinglenotes', emailid);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}

//*************************** Get Clients data *************************************************/
exports.getAllnotes = async function() {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..','..','..', 'neosoft-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        var response = {};
        const identity = await wallet.get('neoUser');
        if (!identity) {
            console.log('An identity for the user "neoUser" does not exist in the wallet');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'neoUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('neochannel');
        const contract = network.getContract('neosoft');
        const result = await contract.evaluateTransaction('getAllnotes');
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        return result;

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        response.error = error.message;
        return response;
    }
}