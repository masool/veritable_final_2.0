
CHANNEL_NAME="$1"
CC_SRC_LANGUAGE="$2"
VERSION="$3"
DELAY="$4"
MAX_RETRY="$5"
VERBOSE="$6"
: ${CHANNEL_NAME:="mychannel"}
: ${CC_SRC_LANGUAGE:="golang"}
: ${VERSION:="1"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

FABRIC_CFG_PATH=$PWD/../config/

if [ "$CC_SRC_LANGUAGE" = "go" -o "$CC_SRC_LANGUAGE" = "golang" ] ; then
	CC_RUNTIME_LANGUAGE=golang
	CC_SRC_PATH="../chaincode/veritable/go/"

	echo Vendoring Go dependencies ...
	pushd ../chaincode/veritable/go
	GO111MODULE=on go mod vendor
	popd
	echo Finished vendoring Go dependencies

elif [ "$CC_SRC_LANGUAGE" = "javascript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH="../chaincode/veritable/javascript/"

elif [ "$CC_SRC_LANGUAGE" = "java" ]; then
	CC_RUNTIME_LANGUAGE=java
	CC_SRC_PATH="../chaincode/veritable/java/build/install/veritable"

	echo Compiling Java code ...
	pushd ../chaincode/veritable/java
	./gradlew installDist
	popd
	echo Finished compiling Java code

elif [ "$CC_SRC_LANGUAGE" = "typescript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH="../chaincode/veritable/typescript/"

	echo Compiling TypeScript code into JavaScript ...
	pushd ../chaincode/veritable/typescript
	npm install
	npm run build
	popd
	echo Finished compiling TypeScript code into JavaScript

else
	echo The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script
	echo Supported chaincode languages are: go, java, javascript, and typescript
	exit 1
fi

# import utils
. scripts/envVar.sh


packageChaincode() {
  PEER=$1
  ORG=$2
  setGlobals $PEER $ORG
  set -x
  peer lifecycle chaincode package veritable.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label veritable_${VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer$PEER.org${ORG} has failed"
  echo "===================== Chaincode is packaged on peer$PEER.org${ORG} ===================== "
  echo
}

# installChaincode PEER ORG
installChaincode() {
  PEER=$1
  ORG=$2
  setGlobals $PEER $ORG
  set -x
  peer lifecycle chaincode install veritable.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer$PEER.org${ORG} has failed"
  echo "===================== Chaincode is installed on peer0.org${ORG} ===================== "
  echo
}

# queryInstalled PEER ORG
queryInstalled() {
  PEER=$1
  ORG=$2
  setGlobals $PEER $ORG
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
	PACKAGE_ID=$(sed -n "/veritable_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer$PEER.org${ORG} has failed"
  echo PackageID is ${PACKAGE_ID}
  echo "===================== Query installed successful on peer$PEER.org${ORG} on channel ===================== "
  echo
}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
  PEER=$1
  ORG=$2
  setGlobals $PEER $ORG
  set -x
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name veritable --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} >&log.txt
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer$PEER.org${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer$PEER.org${ORG} on channel '$CHANNEL_NAME' ===================== "
  echo
}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
  PEER=$1
  ORG=$2
  shift 1
  setGlobals $PEER $ORG
  echo "===================== Checking the commit readiness of the chaincode definition on peer$PEER.org${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to check the commit readiness of the chaincode definition on peer$PEER.org${ORG} secs"
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name veritable --version ${VERSION} --sequence ${VERSION} --output json --init-required >&log.txt
    res=$?
    set +x
    let rc=0
    for var in "$@"
    do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
		COUNTER=$(expr $COUNTER + 1)
	done
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Checking the commit readiness of the chaincode definition successful on peer$PEER.org${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer$PEER.org${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
  VERSION=$1
  shift
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name veritable $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --init-required >&log.txt
    res=$?
    set +x
  else
    set -x
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name veritable $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --init-required >&log.txt
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer${PEER}.org${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition committed on channel '$CHANNEL_NAME' ===================== "
  echo
}

# queryCommitted ORG
queryCommitted() {
  PEER=$1
  ORG=$2
  setGlobals $PEER $ORG
  EXPECTED_RESULT="Version: ${VERSION}, Sequence: ${VERSION}, Endorsement Plugin: escc, Validation Plugin: vscc"
  echo "===================== Querying chaincode definition on peer$PEER.org${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query committed status on peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name veritable >&log.txt
    res=$?
    set +x
		test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: [0-9], Sequence: [0-9], Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query chaincode definition successful on peer$PEER.org${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer$PEER.org${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n veritable $PEER_CONN_PARMS --isInit -c '{"function":"init","Args":[]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}

# chaincodeQuery() {
#   ORG=$1
#   setGlobals $ORG
#   echo "===================== Querying on peer0.org${ORG} on channel '$CHANNEL_NAME'... ===================== "
# 	local rc=1
# 	local COUNTER=1
# 	# continue to poll
#   # we either get a successful response, or reach MAX RETRY
# 	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
#     sleep $DELAY
#     echo "Attempting to Query peer0.org${ORG} ...$(($(date +%s) - starttime)) secs"
#     set -x
#     peer chaincode query -C $CHANNEL_NAME -n veritable -c '{"Args":["queryAllCars"]}' >&log.txt
#     res=$?
#     set +x
# 		let rc=$res
# 		COUNTER=$(expr $COUNTER + 1)
# 	done
#   echo
#   cat log.txt
#   if test $rc -eq 0; then
#     echo "===================== Query successful on peer0.org${ORG} on channel '$CHANNEL_NAME' ===================== "
# 		echo
#   else
#     echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query result on peer0.org${ORG} is INVALID !!!!!!!!!!!!!!!!"
#     echo
#     exit 1
#   fi
# }

## at first we package the chaincode
packageChaincode 0 1
packageChaincode 1 1
packageChaincode 0 2
packageChaincode 1 2
packageChaincode 0 3
packageChaincode 1 3
## Install chaincode on peer0.org1 and peer0.org2
echo "Installing chaincode on peer0.org1..."
installChaincode 0 1
echo "Install chaincode on peer1.org1..."
installChaincode 1 1
echo "Install chaincode on peer0.org2..."
installChaincode 0 2
echo "Install chaincode on peer1.org2..."
installChaincode 1 2
echo "Install chaincode on peer0.org3..."
installChaincode 0 3
echo "Install chaincode on peer1.org3..."
installChaincode 1 3

## query whether the chaincode is installed
queryInstalled 0 1
queryInstalled 1 1
queryInstalled 0 2
queryInstalled 1 2
queryInstalled 0 3
queryInstalled 1 3

## approve the definition for org1
approveForMyOrg 0 1

## check whether the chaincode definition is ready to be committed
## expect org1 to have approved and org2 not to
checkCommitReadiness 0 1 "\"Org1MSP\": true" "\"Org2MSP\": false" "\"Org3MSP\": false"
checkCommitReadiness 0 2 "\"Org1MSP\": true" "\"Org2MSP\": false" "\"Org3MSP\": false"
checkCommitReadiness 0 3 "\"Org1MSP\": true" "\"Org2MSP\": false" "\"Org3MSP\": false"

# approveForMyOrg 1 1

## check whether the chaincode definition is ready to be committed
## expect org1 to have approved and org2 not to
checkCommitReadiness 1 1 "\"Org1MSP\": true" "\"Org2MSP\": false" "\"Org3MSP\": false"
checkCommitReadiness 1 2 "\"Org1MSP\": true" "\"Org2MSP\": false" "\"Org3MSP\": false"
checkCommitReadiness 1 3 "\"Org1MSP\": true" "\"Org2MSP\": false" "\"Org3MSP\": false"

## now approve also for org2
approveForMyOrg 0 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 0 1 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": false"
checkCommitReadiness 0 2 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": false"
checkCommitReadiness 0 3 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": false"

# approveForMyOrg 1 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 1 1 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": false"
checkCommitReadiness 1 2 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": false"
checkCommitReadiness 1 3 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": false"

## now approve also for org2
approveForMyOrg 0 3

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 0 1 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"
checkCommitReadiness 0 2 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"
checkCommitReadiness 0 3 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"

# approveForMyOrg 1 2

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness 1 1 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"
checkCommitReadiness 1 2 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"
checkCommitReadiness 1 3 "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true"
## now that we know for sure both orgs have approved, commit the definition
# commitChaincodeDefinition 1 2
commitChaincodeDefinition 1 0 1 1 1 0 2 1 2 0 3 1 3
#commitChaincodeDefinition 0 1 1
# commitChaincodeDefinition 0 2
# commitChaincodeDefinition 0 3

## query on both orgs to see that the definition committed successfully
queryCommitted 0 1
queryCommitted 1 1
queryCommitted 0 2
queryCommitted 1 2
queryCommitted 0 3
queryCommitted 1 3

## Invoke the chaincode
chaincodeInvokeInit 0 1 1 1 0 2 1 2 0 3 1 3

# sleep 10

# # # Query chaincode on peer0.org1
# # echo "Querying chaincode on peer0.org1..."
# # chaincodeQuery 1
echo
echo "========= All GOOD, Veritable Business Network execution completed =========== "
echo

echo
echo "                _ _        _     _                       _                      _         __          _ "
echo "__   _____ _ __(_) |_ __ _| |__ | | ___       _ __   ___| |___      _____  _ __| | __    /__\ __   __| |"
echo "\ \ / / _ \ '__| | __/ _\` | '_ \| |/ _ \_____| '_ \ / _ \ __\ \ /\ / / _ \| '__| |/ /   /_\| '_ \ / _\` |"
echo " \ V /  __/ |  | | || (_| | |_) | |  __/_____| | | |  __/ |_ \ V  V / (_) | |  |   <   //__| | | | (_| |"
echo "  \_/ \___|_|  |_|\__\__,_|_.__/|_|\___|     |_| |_|\___|\__| \_/\_/ \___/|_|  |_|\_\  \__/|_| |_|\__,_|"
echo "                                                                                                        "
echo

exit 0